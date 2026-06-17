import React, { useEffect, useRef } from "react";

const WIDTH = 980;
const HEIGHT = 420;
const CX = WIDTH / 2;
const CY = HEIGHT / 2 + 10;
const RX = 380;
const RY = 145;
const LANE_WIDTH = 18;
const START_ANGLE = Math.PI;

function laneRadius(lane) {
  return {
    x: RX - lane * LANE_WIDTH,
    y: RY - lane * LANE_WIDTH
  };
}

function drawTrack(ctx) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "#081526";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, "#123d2c");
  gradient.addColorStop(0.42, "#815a22");
  gradient.addColorStop(1, "#281508");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(CX, CY, RX + 58, RY + 58, 0, 0, Math.PI * 2);
  ctx.fill();

  for (let lane = 0; lane <= 6; lane += 1) {
    const radius = laneRadius(lane);
    ctx.beginPath();
    ctx.ellipse(CX, CY, radius.x, radius.y, 0, 0, Math.PI * 2);
    ctx.strokeStyle = lane === 0 || lane === 6 ? "rgba(255,255,255,0.42)" : "rgba(255,255,255,0.18)";
    ctx.lineWidth = lane === 0 || lane === 6 ? 2 : 1;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.ellipse(CX, CY, RX - 6 * LANE_WIDTH - 26, RY - 6 * LANE_WIDTH - 26, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#17472d";
  ctx.fill();

  const finishX = CX - RX - 14;
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(finishX, CY - RY - 34);
  ctx.lineTo(finishX, CY + RY + 34);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 12px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("FINISH", finishX, CY - RY - 46);
}

function drawHorse(ctx, horse, state, index) {
  const angle = state?.angle ?? START_ANGLE;
  const lane = horse.lane ?? index;
  const radius = laneRadius(lane);
  const x = CX + radius.x * Math.cos(angle);
  const y = CY + radius.y * Math.sin(angle);
  const direction = Math.atan2(radius.y * Math.cos(angle), -radius.x * Math.sin(angle));

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(direction);

  ctx.fillStyle = "rgba(0,0,0,0.24)";
  ctx.beginPath();
  ctx.ellipse(0, 9, 22, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = horse.coatColor;
  ctx.strokeStyle = horse.shadeColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 22, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = horse.coatColor;
  ctx.beginPath();
  ctx.ellipse(24, -6, 9, 6, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = horse.maneColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-20, -2);
  ctx.quadraticCurveTo(-32, 4, -26, 18);
  ctx.stroke();

  ctx.fillStyle = horse.jockeyColor;
  ctx.beginPath();
  ctx.ellipse(3, -14, 8, 5, -0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = horse.helmetColor;
  ctx.beginPath();
  ctx.arc(7, -20, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  ctx.fillStyle = "rgba(9,20,38,0.88)";
  ctx.strokeStyle = horse.jockeyColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x - 18, y - 40, 36, 20, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 11px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`#${lane + 1}`, x, y - 26);
}

function RaceCanvas({ horses, liveData }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    drawTrack(ctx);

    const states = new Map((liveData?.horses || []).map((state) => [state.id, state]));
    horses.forEach((horse, index) => drawHorse(ctx, horse, states.get(horse.id), index));
  }, [horses, liveData]);

  return <canvas className="race-sim-canvas" ref={canvasRef} width={WIDTH} height={HEIGHT} />;
}

export default RaceCanvas;
