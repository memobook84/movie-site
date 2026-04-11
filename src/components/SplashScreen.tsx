"use client";

import { useEffect, useState, useRef, useCallback } from "react";

function LightningCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;

      #define OCTAVE_COUNT 10

      vec3 hsv2rgb(vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        return c.z * mix(vec3(1.0), rgb, c.y);
      }

      float hash11(float p) {
        p = fract(p * .1031);
        p *= p + 33.33;
        p *= p + p;
        return fract(p);
      }

      float hash12(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * .1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }

      mat2 rotate2d(float theta) {
        float c = cos(theta);
        float s = sin(theta);
        return mat2(c, -s, s, c);
      }

      float noise(vec2 p) {
        vec2 ip = floor(p);
        vec2 fp = fract(p);
        float a = hash12(ip);
        float b = hash12(ip + vec2(1.0, 0.0));
        float c = hash12(ip + vec2(0.0, 1.0));
        float d = hash12(ip + vec2(1.0, 1.0));
        vec2 t = smoothstep(0.0, 1.0, fp);
        return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < OCTAVE_COUNT; ++i) {
          value += amplitude * noise(p);
          p *= rotate2d(0.45);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      float lightning(vec2 uv, float offset, float seed) {
        vec2 uv2 = uv;
        uv2.x -= offset;
        uv2 += 2.0 * fbm(uv2 * 2.0 + 0.8 * (iTime * 1.6 + seed)) - 1.0;
        float dist = abs(uv2.x);
        return pow(mix(0.0, 0.07, hash11(iTime * 1.6 + seed)) / max(dist, 0.001), 1.0) * 0.6;
      }

      void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec2 uv = fragCoord / iResolution.xy;
        uv = 2.0 * uv - 1.0;
        uv.x *= iResolution.x / iResolution.y;

        float intensity = lightning(uv, 0.0, 0.0);
        vec3 baseColor = vec3(1.0, 1.0, 1.0);
        vec3 col = baseColor * intensity;
        fragColor = vec4(col, 1.0);
      }

      void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `;

    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    const iTimeLocation = gl.getUniformLocation(program, "iTime");

    const startTime = performance.now();
    let animId: number;

    const render = () => {
      resizeCanvas();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(iTimeLocation, (performance.now() - startTime) / 1000.0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        mixBlendMode: "screen",
      }}
    />
  );
}

export default function SplashScreen() {
  const [phase, setPhase] = useState<"hidden" | "fadein" | "show" | "fadeout" | "done">("hidden");
  const [secretMode, setSecretMode] = useState(false);
  const [seriousFace, setSeriousFace] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    const shown = sessionStorage.getItem("splash_shown");
    if (shown) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem("splash_shown", "1");

    const t0 = setTimeout(() => setPhase("fadein"), 50);
    const t1 = setTimeout(() => setPhase("show"), 800);
    const t2 = setTimeout(() => setPhase("fadeout"), 2000);
    const t3 = setTimeout(() => setPhase("done"), 2500);
    timersRef.current = [t0, t1, t2, t3];
    return () => { timersRef.current.forEach(clearTimeout); };
  }, []);

  const handleTitleClick = useCallback(() => {
    if (phase === "done") return;

    if (!secretMode) {
      setSecretMode(true);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      setPhase("show");
    }
  }, [phase, secretMode]);

  const handleSecretClick = useCallback(() => {
    if (!secretMode || seriousFace) return;
    if (isMobile) {
      setPhase("fadeout");
      setTimeout(() => setPhase("done"), 800);
    } else {
      setSeriousFace(true);
      setTimeout(() => {
        setPhase("fadeout");
        setTimeout(() => setPhase("done"), 800);
      }, 600);
    }
  }, [secretMode, seriousFace, isMobile]);

  if (phase === "done") return null;

  const showTitle = !secretMode && (phase === "fadein" || phase === "show");

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 9999,
        backgroundColor: "#000",
        opacity: phase === "fadeout" ? 0 : 1,
        transition: "opacity 0.8s",
      }}
    >
      {/* タイトル（通常モード） */}
      <span
        onClick={handleTitleClick}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${showTitle ? 1 : 0.92})`,
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: "clamp(28px, 5vw, 48px)",
          fontWeight: 900,
          letterSpacing: "0.25em",
          color: "#E6A723",
          whiteSpace: "nowrap",
          opacity: showTitle ? 1 : 0,
          transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          zIndex: 2,
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
          cursor: "default",
        }}
      >
        ARD CINEMA
      </span>

      {/* 隠しコマンドモード: 画像 + 雷 */}
      {secretMode && (
        <div
          onClick={handleSecretClick}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            cursor: "default",
            animation: "secretFadeIn 0.8s ease-out",
          }}
        >
          {/* ジョーカー画像 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={isMobile ? "/secret-mobile.jpg" : seriousFace ? "/secret-serious.jpg" : "/secret.jpg"}
            alt=""
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
          {/* 雷エフェクト（mix-blend-mode: screen で画像の上に合成）— 現在非表示、復活可能 */}
          {/* <LightningCanvas /> */}
        </div>
      )}

      <style>{`
        @keyframes secretFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
