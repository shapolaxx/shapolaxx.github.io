'use client'
import { useEffect, useRef } from 'react'

const VERTEX_SRC = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`

const FRAGMENT_SRC = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)

float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(in vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;mat2 m=mat2(1.,-.5,.2,1.2);for(int i=0;i<5;i++){t+=a*noise(p);p*=2.*m;a*=.5;}return t;}
float clouds(vec2 p){float d=1.,t=.0;for(float i=.0;i<3.;i++){float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);t=mix(t,d,a);d=a;p*=2./(i+1.);}return t;}

void main(void){
  // Use max(R.x,R.y) so uv spans the full viewport on wide screens
  vec2 uv=(FC-.5*R)/max(R.x,R.y)*1.8,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.35,-st.y));
  float breathe=1.-.15*(sin(T*.2)*.5+.5);
  // Bright foreground stars — spread across viewport
  for(float i=1.;i<44.;i++){
    vec2 p=uv*breathe+.75*vec2(
      cos(i*1.3+T*.4+sin(i)*2.1),
      sin(i*1.7+T*.35+cos(i)*1.8)
    );
    float d=length(p);
    col+=.0014/d*(cos(sin(i)*vec3(2.2,1.4,0.6))+1.);
    float b=noise(i+p+bg*1.731);
    col+=.0018*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.05,bg*.08,bg*.22),d*.45);
  }
  // Second layer: tiny dim background stars for density
  for(float j=1.;j<28.;j++){
    vec2 p=uv*breathe+.9*vec2(
      cos(j*2.7+T*.18+sin(j*1.3)*1.6),
      sin(j*2.1+T*.22+cos(j*1.7)*1.4)
    );
    float d=length(p);
    col+=.0007/d*(cos(sin(j)*vec3(1.8,1.2,0.8))+1.);
  }
  // Subtle purple vignette bias toward edges
  col+=vec3(.02,.015,.06)*smoothstep(.2,1.2,length(uv));
  O=vec4(col,1);
}`

class Renderer {
  private gl: WebGL2RenderingContext
  private canvas: HTMLCanvasElement
  private program: WebGLProgram | null = null
  private buffer: WebGLBuffer | null = null
  private uRes: WebGLUniformLocation | null = null
  private uTime: WebGLUniformLocation | null = null
  private scale: number

  constructor(canvas: HTMLCanvasElement, scale: number) {
    this.canvas = canvas
    this.scale = scale
    const gl = canvas.getContext('webgl2')
    if (!gl) throw new Error('WebGL2 not supported')
    this.gl = gl
    this.gl.viewport(0, 0, canvas.width, canvas.height)
  }

  private compile(type: number, src: string): WebGLShader {
    const gl = this.gl
    const sh = gl.createShader(type)!
    gl.shaderSource(sh, src)
    gl.compileShader(sh)
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(sh))
    }
    return sh
  }

  setup() {
    const gl = this.gl
    const vs = this.compile(gl.VERTEX_SHADER, VERTEX_SRC)
    const fs = this.compile(gl.FRAGMENT_SHADER, FRAGMENT_SRC)
    const program = gl.createProgram()!
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program))
    }
    this.program = program

    this.buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW)

    const pos = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

    this.uRes = gl.getUniformLocation(program, 'resolution')
    this.uTime = gl.getUniformLocation(program, 'time')
  }

  resize() {
    const gl = this.gl
    gl.viewport(0, 0, this.canvas.width, this.canvas.height)
  }

  render(ms: number) {
    const gl = this.gl
    if (!this.program) return
    gl.clearColor(0.024, 0.039, 0.078, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(this.program)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
    gl.uniform2f(this.uRes, this.canvas.width, this.canvas.height)
    gl.uniform1f(this.uTime, ms * 1e-3)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  destroy() {
    const gl = this.gl
    if (this.program) gl.deleteProgram(this.program)
    if (this.buffer) gl.deleteBuffer(this.buffer)
  }
}

interface Props {
  className?: string
  style?: React.CSSProperties
}

export default function ShaderBackground({ className, style }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduced = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer: Renderer
    try {
      const dpr = Math.max(1, 0.5 * (window.devicePixelRatio || 1))
      const resize = () => {
        canvas.width = Math.floor(canvas.clientWidth * dpr)
        canvas.height = Math.floor(canvas.clientHeight * dpr)
        renderer?.resize()
      }

      renderer = new Renderer(canvas, dpr)
      renderer.setup()
      resize()

      const ro = new ResizeObserver(resize)
      ro.observe(canvas)

      const loop = (ms: number) => {
        renderer.render(ms)
        if (!reduced) rafRef.current = requestAnimationFrame(loop)
      }
      rafRef.current = requestAnimationFrame(loop)

      return () => {
        cancelAnimationFrame(rafRef.current)
        ro.disconnect()
        renderer.destroy()
      }
    } catch (err) {
      console.warn('ShaderBackground disabled:', err)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        ...style,
      }}
    />
  )
}
