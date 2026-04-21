'use client'
import { useEffect, useRef } from 'react'

const VERTEX_SRC = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`

// Generative soft-photo clouds: warm sky gradient + layered fbm clouds,
// slowly drifting. Designed to read as "photographic sky" more than "shader art".
const FRAGMENT_SRC = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution

float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(in vec2 p){
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float a=rnd(i), b=rnd(i+vec2(1,0)), c=rnd(i+vec2(0,1)), d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p){
  float t=.0, a=.5; mat2 m=mat2(1.,-.5,.2,1.2);
  for(int i=0;i<5;i++){ t+=a*noise(p); p*=2.*m; a*=.5; }
  return t;
}
// Domain-warped "clouds" — produces clear billowy shapes (not smooth fbm)
float clouds(vec2 p){
  float d=1., t=.0;
  for(float i=.0; i<3.; i++){
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);
    d=a;
    p*=2./(i+1.);
  }
  return t;
}

void main(void){
  vec2 uv = FC / R;
  float ar = R.x / R.y;
  vec2 p = (uv - 0.5) * vec2(ar, 1.0) * 2.0;

  // Sky gradient — warm horizon, clear blue upward
  vec3 horizon = vec3(0.995, 0.895, 0.790);
  vec3 midsky  = vec3(0.720, 0.830, 0.945);
  vec3 zenith  = vec3(0.420, 0.620, 0.875);
  vec3 sky = mix(horizon, midsky, smoothstep(0.0, 0.40, uv.y));
  sky = mix(sky, zenith, smoothstep(0.35, 1.0, uv.y));

  // Multiple cloud layers at different scales — lots of distinct puffs
  float c1 = clouds(vec2(p.x * 1.3 + T * 0.16, -p.y * 1.3));
  float c2 = clouds(vec2(p.x * 2.4 - T * 0.11 + 7.0, -p.y * 2.4 + 3.0));
  float c3 = clouds(vec2(p.x * 4.0 + T * 0.09 + 13.0, -p.y * 4.0 - 5.0));

  // Normalized density (weights sum to 1) so smoothstep range is meaningful
  float density = c1 * 0.50 + c2 * 0.32 + c3 * 0.18;

  // Sharp edges, multiple puffs scattered across sky
  float coverage = smoothstep(0.50, 0.66, density);

  // Pure white clouds — no fake "underside" shading that turns them blue
  vec3 cloudCol = vec3(1.0, 1.0, 0.998);

  vec3 col = mix(sky, cloudCol, coverage);

  // Sunlit warmth bleed from bottom-right (imaginary sun off-canvas)
  float sun = smoothstep(1.1, 0.2, distance(uv, vec2(0.85, 0.08)));
  col += vec3(0.06, 0.025, -0.025) * sun * 0.7;

  // Subtle grain for photographic feel
  float grain = rnd(FC) - 0.5;
  col += grain * 0.006;

  O = vec4(col, 1.0);
}`

class Renderer {
  private gl: WebGL2RenderingContext
  private canvas: HTMLCanvasElement
  private program: WebGLProgram | null = null
  private buffer: WebGLBuffer | null = null
  private uRes: WebGLUniformLocation | null = null
  private uTime: WebGLUniformLocation | null = null

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
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
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
  }

  render(ms: number) {
    const gl = this.gl
    if (!this.program) return
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

export default function CloudsBackground({ className, style }: Props) {
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

      renderer = new Renderer(canvas)
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
      console.warn('CloudsBackground disabled:', err)
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
