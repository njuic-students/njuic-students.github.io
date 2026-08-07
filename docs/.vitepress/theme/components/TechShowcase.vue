<template>
  <div class="tech-showcase">
    <div class="tech-showcase-title">
      <span class="tech-title-text">Frontier Technologies</span>
      <span class="tech-title-line" />
    </div>
    <div class="tech-grid" ref="gridRef">
      <a class="tech-card" v-for="(tech, i) in techs" :key="i" :href="tech.link">
        <canvas class="tech-canvas" />
        <div class="tech-info">
          <span class="tech-name">{{ tech.name }}</span>
          <span class="tech-desc">{{ tech.desc }}</span>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const gridRef = ref(null)
let animationIds = []

const base = '/前沿技术/'
const techs = [
  { name: 'Advanced Process & Transistors', desc: 'Planar → FinFET → GAA', link: base + '1-先进制程与晶体管' },
  { name: '2D Semiconductor Materials', desc: 'Atomic-layer Crystal & Sliding', link: base + '2-二维半导体材料' },
  { name: 'Spintronics', desc: 'MTJ & Spin-Transfer Torque', link: base + '3-自旋电子学' },
  { name: 'Chiplet', desc: 'Heterogeneous Die-to-Die', link: base + '4-芯粒' },
  { name: 'High Bandwidth Memory', desc: '3D-Stacked DRAM & TSV', link: base + '5-高带宽存储' },
  { name: 'EDA & AI-Assisted Design', desc: 'RL Placement & Routing', link: base + '6-EDA与AI辅助芯片设计' },
  { name: 'Wide Bandgap Semiconductors', desc: 'SiC, GaN & Ga₂O₃ Power', link: base + '7-宽禁带半导体' },
  { name: 'High-Speed SerDes', desc: 'PAM4 Signaling & Eye Diagram', link: base + '8-高速接口SerDes' },
  { name: 'PMIC', desc: 'Buck, LDO & Multi-Phase', link: base + '9-PMIC' },
  { name: 'RISC-V & Open-Source CPU', desc: '5-Stage Pipeline & Forwarding', link: base + '10-RISC-V与开源处理器' },
  { name: 'AI Processor Architecture', desc: 'Systolic Array & MAC Operation', link: base + '11-AI处理器架构与智能计算系统' },
  { name: 'Neuromorphic Computing', desc: 'Spiking Neural Network', link: base + '12-神经形态计算芯片' },
]

onMounted(() => {
  const dpr = window.devicePixelRatio || 1
  const W = 280, H = 200

  function initCanvas(cvs) {
    cvs.width = W * dpr
    cvs.height = H * dpr
    cvs.style.width = W + 'px'
    cvs.style.height = H + 'px'
    const ctx = cvs.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    return ctx
  }

  // ====== 1. 先进制程与晶体管 — Planar → FinFET → GAA ======
  function startTransistor(cvs) {
    const ctx = initCanvas(cvs)
    let time = 0
    const cx = W / 2, midY = H / 2

    function frame() {
      time++; ctx.clearRect(0, 0, W, H)
      const phase = Math.floor(time / 180) % 3 // 0=Planar, 1=FinFET, 2=GAA
      const pt = (time % 180) / 180
      const phName = ['Planar 90nm', 'FinFET 7nm', 'GAA 3nm'][phase]

      // Source / Drain
      const sdW = 28, sdH = 50, sdGap = 70
      const sx = cx - sdGap / 2 - sdW, sy = midY - sdH / 2
      const dx = cx + sdGap / 2, dy = sy

      // Channel height shrinks per phase
      const chH = [22, 36, 16][phase], chW = sdGap
      const chY = midY - chH / 2

      // Draw substrate
      ctx.fillStyle = 'rgba(0,229,255,0.03)'; ctx.fillRect(40, midY + 15, W - 80, H - midY - 15)

      // Source
      ctx.fillStyle = 'rgba(0,229,255,0.12)'
      ctx.fillRect(sx, sy, sdW, sdH)
      ctx.strokeStyle = 'rgba(0,229,255,0.2)'; ctx.lineWidth = 1
      ctx.strokeRect(sx, sy, sdW, sdH)
      // Drain
      ctx.fillStyle = 'rgba(0,229,255,0.12)'
      ctx.fillRect(dx, dy, sdW, sdH)
      ctx.strokeStyle = 'rgba(0,229,255,0.2)'; ctx.lineWidth = 1
      ctx.strokeRect(dx, dy, sdW, sdH)
      // Labels
      ctx.fillStyle = 'rgba(0,229,255,0.35)'; ctx.font = '6px monospace'
      ctx.fillText('S', sx + sdW / 2 - 3, sy + sdH + 10)
      ctx.fillText('D', dx + sdW / 2 - 3, dy + sdH + 10)

      // Gate oxide — thin line at channel top
      ctx.strokeStyle = 'rgba(124,77,255,0.3)'; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.moveTo(sx + sdW, chY); ctx.lineTo(dx, chY); ctx.stroke()

      // Gate electrode — varies by phase
      const gateH = 8, gateW = chW
      if (phase === 0) {
        // Planar: gate only on top
        ctx.fillStyle = `rgba(124,77,255,${0.2 + Math.sin(time * 0.05) * 0.08})`
        ctx.fillRect(sx + sdW, chY - gateH, gateW, gateH)
        ctx.strokeStyle = 'rgba(124,77,255,0.35)'; ctx.lineWidth = 1
        ctx.strokeRect(sx + sdW, chY - gateH, gateW, gateH)
      } else if (phase === 1) {
        // FinFET: gate wraps 3 sides (top + left + right on the fin)
        const finW = 12, finX = cx - finW / 2
        const finH = chH
        ctx.fillStyle = 'rgba(0,229,255,0.08)'
        ctx.fillRect(finX, chY, finW, finH)
        // Gate wraps
        ctx.fillStyle = `rgba(124,77,255,${0.18 + Math.sin(time * 0.05) * 0.08})`
        ctx.fillRect(sx + sdW - 3, chY - gateH, gateW + 6, gateH + finH + gateH)
        ctx.clearRect(sx + sdW + 4, chY, gateW - 2, finH) // clear inner
        ctx.strokeStyle = 'rgba(124,77,255,0.3)'; ctx.lineWidth = 1
        ctx.strokeRect(sx + sdW - 3, chY - gateH, gateW + 6, gateH + finH + gateH)
      } else {
        // GAA: gate fully surrounds the nanosheet channel
        const nsH = 10, nsW = chW - 8, nsX = sx + sdW + 4, nsY = midY - nsH / 2
        ctx.fillStyle = 'rgba(0,229,255,0.1)'
        ctx.fillRect(nsX, nsY, nsW, nsH)
        const gaaAlpha = 0.18 + Math.sin(time * 0.05) * 0.06
        ctx.fillStyle = `rgba(124,77,255,${gaaAlpha})`
        ctx.fillRect(nsX - 4, nsY - 5, nsW + 8, nsH + 10)
        ctx.clearRect(nsX, nsY, nsW, nsH)
        ctx.strokeStyle = 'rgba(124,77,255,0.3)'; ctx.lineWidth = 1
        ctx.strokeRect(nsX - 4, nsY - 5, nsW + 8, nsH + 10)
      }

      // Electron flow in channel
      const eCount = 14
      for (let i = 0; i < eCount; i++) {
        const ex = sx + sdW + 4 + ((time * 0.6 + i * chW / eCount) % chW)
        const ey = midY + Math.sin(time * 0.08 + i * 0.7) * 4
        const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, 3)
        g.addColorStop(0, 'rgba(0,229,255,0.35)'); g.addColorStop(1, 'transparent')
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ex, ey, 3, 0, Math.PI * 2); ctx.fill()
      }

      // Leakage — faint red below channel (strongest in planar, gone in GAA)
      if (phase === 0) {
        const la = 0.04 + Math.sin(time * 0.06) * 0.02
        ctx.fillStyle = `rgba(255,50,50,${la})`
        ctx.fillRect(sx + sdW + 4, midY + chH / 2, chW - 8, 6)
      } else if (phase === 1) {
        const la = 0.015 + Math.sin(time * 0.06) * 0.01
        ctx.fillStyle = `rgba(255,50,50,${la})`
        ctx.fillRect(sx + sdW + 4, midY + chH / 2, chW - 8, 3)
      }

      // Phase label + node
      const nodeColor = phase === 2 ? 'rgba(0,230,118,0.5)' : 'rgba(0,229,255,0.4)'
      ctx.fillStyle = nodeColor; ctx.font = '7px monospace'
      ctx.fillText(phName, W / 2 - ctx.measureText(phName).width / 2, H - 10)

      // Gate control quality indicator
      const qi = [0.35, 0.65, 0.92][phase]
      ctx.fillStyle = 'rgba(0,229,255,0.12)'
      ctx.fillRect(20, H - 25, 60, 2)
      const qgr = ctx.createLinearGradient(20, 0, 20 + 60 * qi, 0)
      qgr.addColorStop(0, 'rgba(0,229,255,0.5)'); qgr.addColorStop(1, 'rgba(0,230,118,0.4)')
      ctx.fillStyle = qgr; ctx.fillRect(20, H - 25, 60 * qi, 2)
      ctx.fillStyle = 'rgba(0,229,255,0.25)'; ctx.font = '5px monospace'
      ctx.fillText('gate control', 20, H - 28)

      animationIds[0] = requestAnimationFrame(frame)
    }
    frame()
  }

  // ====== 2. 二维半导体材料 — 六角晶格 + 层间滑移 ======
  function start2DMaterial(cvs) {
    const ctx = initCanvas(cvs)
    let time = 0
    const hexR = 10, rowH = hexR * 1.5, colW = hexR * Math.sqrt(3)
    const atoms = []

    // Build two-layer hexagonal lattice
    for (let layer = 0; layer < 2; layer++) {
      for (let row = -2; row < 12; row++) {
        const offsetX = row % 2 === 0 ? 0 : colW / 2
        for (let col = -2; col < 20; col++) {
          const x = col * colW + offsetX, y = 30 + row * rowH + layer * 40
          atoms.push({ x, y, layer, hue: layer === 0 ? 270 : 185, r: layer === 0 ? 2.8 : 2.2 })
        }
      }
    }
    // Inter-layer vdW bonds
    const bonds = atoms.filter(a => a.layer === 0).slice(0, 80).map(a => {
      const mate = atoms.find(b => b.layer === 1 && Math.abs(b.x - a.x) < 3 && Math.abs(b.y - (a.y + 40)) < 6)
      return mate ? { x1: a.x, y1: a.y + 40, x2: mate.x, y2: mate.y, a, b: mate } : null
    }).filter(Boolean)

    function frame() {
      time++; ctx.clearRect(0, 0, W, H)
      const slide = (time * 0.08) % colW // slow slide, reset when one full cell

      // Layer labels
      ctx.fillStyle = 'rgba(180,130,255,0.35)'; ctx.font = '6px monospace'
      ctx.fillText('TMD (MoS₂)', 8, 42)
      ctx.fillStyle = 'rgba(0,229,255,0.3)'
      ctx.fillText('TMD (WS₂)', 8, 82)

      // vdW dashed lines between layers (only draw bonds near visible area)
      bonds.slice(0, 40).forEach(b => {
        if (b.y2 < 20 || b.y2 > H - 15) return
        const bx = b.x1 + slide * 0.5
        ctx.strokeStyle = 'rgba(124,77,255,0.04)'; ctx.lineWidth = 0.3
        ctx.setLineDash([2, 4])
        ctx.beginPath(); ctx.moveTo(bx, b.y1); ctx.lineTo(b.x2, b.y2); ctx.stroke()
        ctx.setLineDash([])
      })

      // Atoms - upper layer (static)
      atoms.filter(a => a.layer === 1).forEach(a => {
        if (a.y < 20 || a.y > H - 10) return
        const p = 0.5 + Math.sin(time * 0.03 + a.x * 0.3 + a.y * 0.2) * 0.3
        const g = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.r * 3)
        g.addColorStop(0, `hsla(${a.hue},70%,60%,${0.15 * p})`); g.addColorStop(1, 'transparent')
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(a.x, a.y, a.r * 3, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = `hsla(${a.hue},70%,55%,${0.3 * p})`
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill()
      })

      // Atoms - lower layer (sliding)
      atoms.filter(a => a.layer === 0).forEach(a => {
        const ax = a.x + slide
        if (a.y < 5 || a.y > H - 10) return
        const p = 0.5 + Math.sin(time * 0.03 + a.x * 0.3 + a.y * 0.2 + 2) * 0.3
        const g = ctx.createRadialGradient(ax, a.y, 0, ax, a.y, a.r * 3.5)
        g.addColorStop(0, `hsla(${a.hue},80%,65%,${0.13 * p})`); g.addColorStop(1, 'transparent')
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ax, a.y, a.r * 3.5, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = `hsla(${a.hue},80%,60%,${0.28 * p})`
        ctx.beginPath(); ctx.arc(ax, a.y, a.r + 0.5, 0, Math.PI * 2); ctx.fill()
      })

      // Lattice ghost lines on upper layer
      atoms.filter(a => a.layer === 1).slice(0, 60).forEach(a => {
        if (a.y < 20 || a.y > H - 10) return
        // connect to right neighbor
        const right = atoms.find(b => b.layer === 1 && b.y === a.y && b.x > a.x && b.x - a.x < colW + 2)
        if (right && right.y < H - 10 && right.y > 20) {
          ctx.strokeStyle = 'rgba(0,229,255,0.04)'; ctx.lineWidth = 0.4
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(right.x, right.y); ctx.stroke()
        }
      })

      // Profile edge indicator
      ctx.strokeStyle = 'rgba(0,229,255,0.12)'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(W - 15, 18); ctx.lineTo(W - 15, H - 8); ctx.stroke()
      ctx.fillStyle = 'rgba(0,229,255,0.25)'; ctx.font = '5px monospace'
      ctx.fillText('0.7nm', W - 42, H - 6)

      animationIds[1] = requestAnimationFrame(frame)
    }
    frame()
  }

  // ====== 3. 自旋电子学 — MTJ + 自旋翻转 ======
  function startSpintronics(cvs) {
    const ctx = initCanvas(cvs)
    let time = 0
    const mtx = 80, tw = 90, th = 18, gap = 4

    function frame() {
      time++; ctx.clearRect(0, 0, W, H)

      const cycle = (time % 320) / 320
      const isParallel = cycle < 0.5 // parallel → antiparallel → parallel
      const flipProgress = cycle < 0.5 ? 0 : Math.min((cycle - 0.5) / 0.3, 1)
      const flipped = flipProgress > 0.5

      // Top contact
      ctx.fillStyle = 'rgba(0,229,255,0.1)'; ctx.fillRect(mtx - 4, 30, tw + 8, 8)

      // Top FM layer (fixed)
      const fm1Y = 42
      ctx.fillStyle = 'rgba(124,77,255,0.15)'; ctx.fillRect(mtx, fm1Y, tw, th)
      ctx.strokeStyle = 'rgba(124,77,255,0.25)'; ctx.lineWidth = 1
      ctx.strokeRect(mtx, fm1Y, tw, th)
      ctx.fillStyle = 'rgba(0,229,255,0.3)'; ctx.font = '6px monospace'
      ctx.fillText('CoFeB (fixed)', mtx + tw + 8, fm1Y + 12)

      // Tunnel barrier
      const tbY = fm1Y + th
      ctx.fillStyle = 'rgba(0,229,255,0.08)'; ctx.fillRect(mtx + 5, tbY, tw - 10, gap)

      // Bottom FM layer (free)
      const fm2Y = tbY + gap
      ctx.fillStyle = flipped ? 'rgba(180,130,255,0.12)' : 'rgba(124,77,255,0.15)'
      ctx.fillRect(mtx, fm2Y, tw, th)
      ctx.strokeStyle = flipped ? 'rgba(180,130,255,0.2)' : 'rgba(124,77,255,0.25)'
      ctx.lineWidth = 1; ctx.strokeRect(mtx, fm2Y, tw, th)
      ctx.fillStyle = 'rgba(0,229,255,0.3)'; ctx.font = '6px monospace'
      ctx.fillText('CoFeB (free)', mtx + tw + 8, fm2Y + 12)

      // Spin arrows in fixed layer (always ↑)
      for (let i = 0; i < 6; i++) {
        const ax = mtx + 10 + i * 14, ay = fm1Y + th / 2
        ctx.fillStyle = 'rgba(0,229,255,0.4)'
        ctx.beginPath(); ctx.moveTo(ax, ay - 5); ctx.lineTo(ax - 3, ay + 2); ctx.lineTo(ax + 3, ay + 2); ctx.closePath(); ctx.fill()
      }

      // Spin arrows in free layer (flip)
      for (let i = 0; i < 6; i++) {
        const ax = mtx + 10 + i * 14, ay = fm2Y + th / 2
        const angle = flipped ? Math.PI : 0
        const alpha = 0.35 + Math.sin(time * 0.08 + i) * 0.1
        ctx.fillStyle = flipped ? `rgba(180,130,255,${alpha})` : `rgba(0,229,255,${alpha})`
        ctx.save(); ctx.translate(ax, ay); ctx.rotate(angle)
        ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(-3, 2); ctx.lineTo(3, 2); ctx.closePath()
        ctx.fill(); ctx.restore()
      }

      // Current pulse during flip
      if (flipProgress > 0.1 && flipProgress < 0.9) {
        const pa = Math.sin(flipProgress * Math.PI) * 0.4
        ctx.strokeStyle = `rgba(0,229,255,${pa})`; ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(mtx + tw / 2, 20); ctx.lineTo(mtx + tw / 2, fm2Y + th + 10); ctx.stroke()
        // Pulse particles
        for (let p = 0; p < 4; p++) {
          const py = 20 + ((time * 2 + p * 20) % (fm2Y + th - 10))
          const g = ctx.createRadialGradient(mtx + tw / 2, py, 0, mtx + tw / 2, py, 4)
          g.addColorStop(0, 'rgba(0,229,255,0.6)'); g.addColorStop(1, 'transparent')
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mtx + tw / 2, py, 4, 0, Math.PI * 2); ctx.fill()
        }
      }

      // TMR resistance indicator
      const rBarY = H - 28
      ctx.fillStyle = 'rgba(0,229,255,0.12)'; ctx.fillRect(mtx, rBarY, tw, 2)
      const rVal = flipped ? 0.75 : 0.2
      const rg = ctx.createLinearGradient(mtx, 0, mtx + tw * rVal, 0)
      if (flipped) {
        rg.addColorStop(0, 'rgba(255,80,80,0.4)'); rg.addColorStop(1, 'rgba(255,80,80,0.15)')
      } else {
        rg.addColorStop(0, 'rgba(0,230,118,0.4)'); rg.addColorStop(1, 'rgba(0,230,118,0.15)')
      }
      ctx.fillStyle = rg; ctx.fillRect(mtx, rBarY, tw * rVal, 2)

      const stateLabel = flipped ? 'Anti-Parallel (High R)' : 'Parallel (Low R)'
      const stateColor = flipped ? 'rgba(255,80,80,0.3)' : 'rgba(0,230,118,0.35)'
      ctx.fillStyle = stateColor; ctx.font = '6px monospace'
      ctx.fillText(stateLabel, mtx, H - 8)
      ctx.fillText('TMR: ' + (flipped ? '~200%' : '~0%'), mtx + tw - 40, H - 8)

      animationIds[2] = requestAnimationFrame(frame)
    }
    frame()
  }

  // ====== 4. 芯粒 — 多 die 在硅中介层上的互连 ======
  function startChiplet(cvs) {
    const ctx = initCanvas(cvs)
    let time = 0
    const chiplets = [
      { x: 20, y: 30, w: 62, h: 40, label: 'CPU', hue: 185 },
      { x: 98, y: 25, w: 50, h: 36, label: 'GPU', hue: 200 },
      { x: 165, y: 32, w: 44, h: 34, label: 'I/O', hue: 220 },
      { x: 215, y: 80, w: 38, h: 30, label: 'SRAM', hue: 250 },
      { x: 28, y: 88, w: 50, h: 32, label: 'Accel', hue: 270 },
    ]
    const interposer = { x: 12, y: 22, w: W - 24, h: H - 55 }

    // precompute micro-bump positions per chiplet
    const bumps = chiplets.map(c => {
      const bps = []
      const margin = 6, spacing = 14
      // top & bottom edges
      for (let bx = c.x + margin; bx < c.x + c.w - margin; bx += spacing) {
        bps.push({ x: bx, y: c.y, cx: c.x, o: 't' })
        bps.push({ x: bx, y: c.y + c.h, cx: c.x, o: 'b' })
      }
      for (let by = c.y + margin; by < c.y + c.h - margin; by += spacing) {
        bps.push({ x: c.x, y: by, cx: c.x, o: 'l' })
        bps.push({ x: c.x + c.w, y: by, cx: c.x, o: 'r' })
      }
      return bps
    })

    // build connections between nearby chiplets
    const connections = []
    for (let i = 0; i < chiplets.length; i++) {
      for (let j = i + 1; j < chiplets.length; j++) {
        const ci = chiplets[i], cj = chiplets[j]
        const dx = (ci.x + ci.w / 2) - (cj.x + cj.w / 2)
        const dy = (ci.y + ci.h / 2) - (cj.y + cj.h / 2)
        if (Math.sqrt(dx * dx + dy * dy) < 100) {
          const biList = bumps[i], bjList = bumps[j]
          if (biList.length && bjList.length) {
            const bi = biList[Math.floor(Math.random() * biList.length)]
            const bj = bjList[Math.floor(Math.random() * bjList.length)]
            if (bi && bj) connections.push({ x1: bi.x, y1: bi.y, x2: bj.x, y2: bj.y })
          }
        }
      }
    }

    function frame() {
      time++; ctx.clearRect(0, 0, W, H)

      // Interposer
      ctx.fillStyle = 'rgba(0,229,255,0.02)'; ctx.fillRect(interposer.x, interposer.y, interposer.w, interposer.h)
      ctx.strokeStyle = 'rgba(0,229,255,0.06)'; ctx.lineWidth = 0.5
      ctx.strokeRect(interposer.x, interposer.y, interposer.w, interposer.h)
      ctx.fillStyle = 'rgba(0,229,255,0.15)'; ctx.font = '5px monospace'
      ctx.fillText('Si Interposer', interposer.x + 4, interposer.y + interposer.h - 4)

      // Chiplets
      chiplets.forEach(c => {
        ctx.fillStyle = `hsla(${c.hue},70%,55%,0.08)`
        ctx.fillRect(c.x, c.y, c.w, c.h)
        ctx.strokeStyle = `hsla(${c.hue},70%,60%,0.2)`; ctx.lineWidth = 0.8
        ctx.strokeRect(c.x, c.y, c.w, c.h)
        ctx.fillStyle = `hsla(${c.hue},70%,65%,0.4)`; ctx.font = 'bold 7px monospace'
        ctx.fillText(c.label, c.x + c.w / 2 - ctx.measureText(c.label).width / 2, c.y + c.h / 2 + 3)
      })

      // Connections
      connections.forEach(conn => {
        ctx.strokeStyle = 'rgba(0,229,255,0.05)'; ctx.lineWidth = 0.5
        ctx.beginPath(); ctx.moveTo(conn.x1, conn.y1); ctx.lineTo(conn.x2, conn.y2); ctx.stroke()
      })

      // Micro bumps (small dots on edges)
      bumps.forEach((bpList, ci) => {
        const c = chiplets[ci]
        bpList.forEach(bp => {
          ctx.fillStyle = `rgba(0,229,255,0.1)`
          ctx.beginPath(); ctx.arc(bp.x, bp.y, 1.2, 0, Math.PI * 2); ctx.fill()
        })
      })

      // Data packets along connections
      connections.forEach((conn, cIdx) => {
        const t = ((time * 0.03 + cIdx * 0.37) % 1)
        const px = conn.x1 + (conn.x2 - conn.x1) * t
        const py = conn.y1 + (conn.y2 - conn.y1) * t
        const g = ctx.createRadialGradient(px, py, 0, px, py, 4)
        g.addColorStop(0, 'rgba(0,229,255,0.5)'); g.addColorStop(1, 'transparent')
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill()
      })

      // Active chiplet indicator
      const activeIdx = Math.floor(time / 60) % chiplets.length
      const ac = chiplets[activeIdx]
      ctx.strokeStyle = `rgba(0,229,255,${0.2 + Math.sin(time * 0.12) * 0.1})`; ctx.lineWidth = 1.2
      ctx.strokeRect(ac.x - 2, ac.y - 2, ac.w + 4, ac.h + 4)

      ctx.fillStyle = 'rgba(0,229,255,0.2)'; ctx.font = '5px monospace'
      ctx.fillText('UCIe 2.0', W - 42, H - 6)

      animationIds[3] = requestAnimationFrame(frame)
    }
    frame()
  }

  // ====== 5. 高带宽存储 — 3D 堆叠 DRAM + TSV ======
  function startHBM(cvs) {
    const ctx = initCanvas(cvs)
    let time = 0
    const stackX = 80, layerW = 100, layerH = 14, layerGap = 3, numLayers = 6
    const baseY = H - 35, stackTop = baseY - numLayers * (layerH + layerGap)
    const tsvCount = 9

    function frame() {
      time++; ctx.clearRect(0, 0, W, H)

      const hi = 4 + Math.floor(time / 200) % 5 // cycle 4,6,8,12,16 Hi
      const hiLabels = [4, 6, 8, 12, 16]

      // DRAM layers
      for (let l = 0; l < numLayers; l++) {
        const ly = stackTop + l * (layerH + layerGap)
        const pulse = 0.5 + Math.sin(time * 0.03 + l * 0.8) * 0.2
        ctx.fillStyle = `rgba(0,229,255,${0.03 * pulse})`
        ctx.fillRect(stackX, ly, layerW, layerH)
        ctx.strokeStyle = `rgba(0,229,255,${0.08 * pulse})`; ctx.lineWidth = 0.5
        ctx.strokeRect(stackX, ly, layerW, layerH)

        // Memory cells (tiny dots)
        for (let c = 0; c < 40; c++) {
          const cx = stackX + 5 + Math.floor(c / 4) * 10, cy = ly + 3 + (c % 4) * 3
          const ca = 0.03 + Math.sin(time * 0.04 + l * 0.5 + c) * 0.02
          ctx.fillStyle = `rgba(0,229,255,${ca})`
          ctx.fillRect(cx, cy, 1.5, 1.5)
        }
      }

      // TSVs
      for (let t = 0; t < tsvCount; t++) {
        const tx = stackX + 10 + t * (layerW - 20) / (tsvCount - 1)
        ctx.strokeStyle = 'rgba(124,77,255,0.08)'; ctx.lineWidth = 0.8
        ctx.beginPath(); ctx.moveTo(tx, stackTop); ctx.lineTo(tx, baseY); ctx.stroke()

        // Data pulse along TSV
        const pulsePhase = ((time * 0.12 + t * 0.4) % 1)
        const py = stackTop + pulsePhase * (baseY - stackTop)
        const g = ctx.createRadialGradient(tx, py, 0, tx, py, 3)
        g.addColorStop(0, `rgba(0,229,255,${0.3 * (1 - Math.abs(pulsePhase - 0.5) * 2)})`)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(tx, py, 3, 0, Math.PI * 2); ctx.fill()
      }

      // Base logic die
      ctx.fillStyle = 'rgba(0,229,255,0.06)'; ctx.fillRect(stackX - 5, baseY, layerW + 10, 12)
      ctx.strokeStyle = 'rgba(0,229,255,0.12)'; ctx.lineWidth = 0.8
      ctx.strokeRect(stackX - 5, baseY, layerW + 10, 12)
      ctx.fillStyle = 'rgba(0,229,255,0.35)'; ctx.font = '6px monospace'
      ctx.fillText('Logic Die', stackX + layerW / 2 - 20, baseY + 9)

      // Bandwidth display
      const bw = (0.8 + Math.sin(time * 0.04) * 0.15).toFixed(1)
      ctx.fillStyle = 'rgba(0,229,255,0.4)'; ctx.font = '8px monospace'
      ctx.fillText(`BW: ${bw} TB/s`, stackX + layerW + 16, stackTop + 20)
      ctx.fillText(`${hiLabels[hi % 5]}-Hi Stack`, stackX + layerW + 16, stackTop + 36)

      // GPU/CPU connection arrow
      const arrowX = stackX + layerW + 8, arrowY = baseY + 6
      ctx.strokeStyle = 'rgba(0,229,255,0.12)'; ctx.lineWidth = 0.8
      ctx.beginPath(); ctx.moveTo(arrowX, arrowY); ctx.lineTo(W - 10, arrowY); ctx.stroke()
      ctx.fillStyle = 'rgba(0,229,255,0.2)'; ctx.font = '5px monospace'
      ctx.fillText('GPU', W - 28, arrowY - 4)

      // TSV label
      ctx.fillStyle = 'rgba(124,77,255,0.2)'; ctx.font = '5px monospace'
      ctx.fillText('TSV', stackX - 18, stackTop + (baseY - stackTop) / 2)

      animationIds[4] = requestAnimationFrame(frame)
    }
    frame()
  }

  // ====== 6. EDA 与 AI 辅助芯片设计 — 布局 + 布线 + 热力图 ======
  function startEDA(cvs) {
    const ctx = initCanvas(cvs)
    let time = 0
    const gridX = 10, gridY = 30, gridW = 170, gridH = 140, cols = 10, rows = 9
    const cellW = gridW / cols, cellH = gridH / rows

    // Generate random cells
    const cells = Array.from({ length: 35 }, () => ({
      col: Math.floor(Math.random() * cols),
      row: Math.floor(Math.random() * rows),
      hue: [185, 200, 220, 250, 270][Math.floor(Math.random() * 5)],
      w: 1 + (Math.random() > 0.6 ? 1 : 0),
      h: 1,
    }))

    // Heat spots that shrink over time (AI optimization)
    const hotSpots = [
      { cx: 60, cy: 60, baseR: 35, phase: 0 },
      { cx: 130, cy: 100, baseR: 28, phase: 0.3 },
      { cx: 80, cy: 130, baseR: 22, phase: 0.6 },
    ]

    function frame() {
      time++; ctx.clearRect(0, 0, W, H)

      // Grid
      ctx.strokeStyle = 'rgba(0,229,255,0.03)'; ctx.lineWidth = 0.3
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath(); ctx.moveTo(gridX, gridY + r * cellH); ctx.lineTo(gridX + gridW, gridY + r * cellH); ctx.stroke()
      }
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath(); ctx.moveTo(gridX + c * cellW, gridY); ctx.lineTo(gridX + c * cellW, gridY + gridH); ctx.stroke()
      }

      // Heat spots (shrinking over time — AI optimization)
      const converge = Math.min(time / 400, 0.85)
      hotSpots.forEach(hs => {
        const r = hs.baseR * (1 - converge * 0.7)
        if (r < 3) return
        const redAlpha = (0.06 * (1 - converge)) + 0.01
        const g = ctx.createRadialGradient(hs.cx, hs.cy, 0, hs.cx, hs.cy, r)
        g.addColorStop(0, `rgba(255,50,50,${redAlpha})`)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hs.cx, hs.cy, r, 0, Math.PI * 2); ctx.fill()
      })

      // Cool optimized zones
      if (converge > 0.4) {
        const ca = (converge - 0.4) * 0.06
        hotSpots.forEach(hs => {
          const g = ctx.createRadialGradient(hs.cx, hs.cy, 0, hs.cx, hs.cy, hs.baseR * 0.5)
          g.addColorStop(0, `rgba(0,230,118,${ca})`); g.addColorStop(1, 'transparent')
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hs.cx, hs.cy, hs.baseR * 0.5, 0, Math.PI * 2); ctx.fill()
        })
      }

      // Cells
      cells.forEach(c => {
        const cx = gridX + c.col * cellW + 1, cy = gridY + c.row * cellH + 1
        ctx.fillStyle = `hsla(${c.hue},70%,55%,0.12)`
        ctx.fillRect(cx, cy, cellW * c.w - 2, cellH * c.h - 2)
      })

      // Routing paths (gradually appearing)
      const totalRoutes = 12
      for (let r = 0; r < totalRoutes; r++) {
        const appearTime = r * 30
        if (time < appearTime) continue
        const routeProgress = Math.min((time - appearTime) / 60, 1)
        const sc = cells[r % cells.length]
        const ec = cells[(r * 3 + 5) % cells.length]
        if (sc === ec) continue
        const sx = gridX + sc.col * cellW + cellW / 2, sy = gridY + sc.row * cellH + cellH / 2
        const ex = gridX + ec.col * cellW + cellW / 2, ey = gridY + ec.row * cellH + cellH / 2
        const mx = sx + (ex - sx) * routeProgress, my = sy + (ey - sy) * routeProgress

        ctx.strokeStyle = 'rgba(0,229,255,0.06)'; ctx.lineWidth = 0.5
        ctx.beginPath(); ctx.moveTo(sx, sy)
        // Manhattan routing: horizontal then vertical
        const midX = sx + (ex - sx) * Math.min(routeProgress * 2, 1)
        const midY = sy + (ey - sy) * Math.max(0, Math.min((routeProgress - 0.5) * 2, 1))
        ctx.lineTo(midX, sy); ctx.lineTo(midX, midY); ctx.stroke()
      }

      // AI network on right
      const nnX = 192, nnY = 50
      const nnLayers = [[nnX, 0], [nnX + 28, 0], [nnX + 56, 0]]
      const nnCounts = [4, 4, 2]
      nnLayers.forEach((nl, li) => {
        for (let n = 0; n < nnCounts[li]; n++) {
          const ny = nnY + 20 + n * 30 - (nnCounts[li] - 1) * 15
          const p = 0.4 + Math.sin(time * 0.05 + li + n) * 0.2
          const g = ctx.createRadialGradient(nl[0], ny, 0, nl[0], ny, 8)
          g.addColorStop(0, `rgba(124,77,255,${0.12 * p})`); g.addColorStop(1, 'transparent')
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(nl[0], ny, 8, 0, Math.PI * 2); ctx.fill()
          ctx.fillStyle = `rgba(124,77,255,${0.35 * p})`
          ctx.beginPath(); ctx.arc(nl[0], ny, 3, 0, Math.PI * 2); ctx.fill()
          // connections to next layer
          if (li < nnLayers.length - 1) {
            const nl2 = nnLayers[li + 1]
            for (let nn = 0; nn < nnCounts[li + 1]; nn++) {
              const ny2 = nnY + 20 + nn * 30 - (nnCounts[li + 1] - 1) * 15
              ctx.strokeStyle = 'rgba(124,77,255,0.04)'; ctx.lineWidth = 0.3
              ctx.beginPath(); ctx.moveTo(nl[0] + 5, ny); ctx.lineTo(nl2[0] - 5, ny2); ctx.stroke()
            }
          }
        }
      })
      ctx.fillStyle = 'rgba(124,77,255,0.25)'; ctx.font = '5px monospace'
      ctx.fillText('AI Engine', nnX + 2, nnY - 2)

      // Labels
      const labels = ['Placing...', 'Routing...', 'ECO...']
      const activeLabel = Math.floor(time / 100) % 3
      ctx.fillStyle = 'rgba(0,229,255,0.35)'; ctx.font = '6px monospace'
      ctx.fillText(labels[activeLabel], gridX + 2, gridY - 4)

      ctx.fillStyle = 'rgba(0,230,118,0.25)'; ctx.font = '5px monospace'
      ctx.fillText(`PPA: +${Math.floor(converge * 18)}%`, W - 50, H - 6)

      animationIds[5] = requestAnimationFrame(frame)
    }
    frame()
  }

  // ====== 7. 宽禁带半导体 — 能带图对比 ======
  function startWBG(cvs) {
    const ctx = initCanvas(cvs)
    let time = 0

    function frame() {
      time++; ctx.clearRect(0, 0, W, H)

      // Left: Si (narrow bandgap)
      const lx = 20, lw = 95
      const siGap = 16
      // Right: WBG (SiC/GaN cycle)
      const rx = 145, rw = 95
      const wbgGap = 42
      const wbgName = Math.floor(time / 200) % 3 === 0 ? 'SiC (3.3eV)' : Math.floor(time / 200) % 3 === 1 ? 'GaN (3.4eV)' : 'Ga₂O₃ (4.8eV)'

      // Valence bands
      const vbY = H - 40
      // Conduction bands
      const siCB = vbY - siGap, wbgCB = vbY - wbgGap

      // Section labels
      ctx.fillStyle = 'rgba(0,229,255,0.35)'; ctx.font = '7px monospace'
      ctx.fillText('Si (1.1eV)', lx + lw / 2 - 28, 16)
      ctx.fillText(wbgName, rx + rw / 2 - 28, 16)

      // Si bands
      ctx.fillStyle = 'rgba(0,229,255,0.06)'; ctx.fillRect(lx, siCB - 8, lw, 14) // CB
      ctx.fillStyle = 'rgba(0,229,255,0.06)'; ctx.fillRect(lx, vbY - 4, lw, 14) // VB
      ctx.strokeStyle = 'rgba(0,229,255,0.2)'; ctx.lineWidth = 1
      ctx.strokeRect(lx, siCB - 8, lw, 14)
      ctx.strokeRect(lx, vbY - 4, lw, 14)
      ctx.fillStyle = 'rgba(0,229,255,0.3)'; ctx.font = '5px monospace'
      ctx.fillText('Ec', lx - 3, siCB - 10)
      ctx.fillText('Ev', lx - 3, vbY + 9)

      // WBG bands
      ctx.fillStyle = 'rgba(0,229,255,0.06)'; ctx.fillRect(rx, wbgCB - 8, rw, 14)
      ctx.fillStyle = 'rgba(0,229,255,0.06)'; ctx.fillRect(rx, vbY - 4, rw, 14)
      ctx.strokeStyle = 'rgba(0,229,255,0.2)'; ctx.lineWidth = 1
      ctx.strokeRect(rx, wbgCB - 8, rw, 14)
      ctx.strokeRect(rx, vbY - 4, rw, 14)
      ctx.fillText('Ec', rx - 3, wbgCB - 10)
      ctx.fillText('Ev', rx - 3, vbY + 9)

      // Gap labels
      ctx.fillStyle = 'rgba(124,77,255,0.2)'; ctx.font = '5px monospace'
      ctx.fillText('1.1eV', lx + lw / 2 - 10, vbY - siGap / 2 + 2)
      ctx.fillText(wbgName.includes('3.3') ? '3.3eV' : wbgName.includes('3.4') ? '3.4eV' : '4.8eV', rx + rw / 2 - 12, vbY - wbgGap / 2 + 2)

      // Thermal excitation electrons in Si (leakage)
      for (let i = 0; i < 3; i++) {
        const ex = lx + 15 + ((time * 0.3 + i * lw / 3) % lw)
        const ey = siCB - 6 + Math.sin(time * 0.05 + i) * 3
        ctx.fillStyle = `rgba(255,50,50,${0.1 + Math.sin(time * 0.06 + i) * 0.04})`
        ctx.beginPath(); ctx.arc(ex, ey, 2, 0, Math.PI * 2); ctx.fill()
      }

      // High-field excitation in WBG (bright electrons)
      const efield = time % 250 > 100
      if (efield) {
        const fieldPulse = Math.sin((time % 250 - 100) / 150 * Math.PI)
        // Electric field arrow
        ctx.strokeStyle = `rgba(0,229,255,${0.2 * fieldPulse})`; ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(rx + rw / 2, vbY + 20); ctx.lineTo(rx + rw / 2, wbgCB - 20); ctx.stroke()
        ctx.fillStyle = `rgba(0,229,255,${0.25 * fieldPulse})`
        ctx.beginPath(); ctx.moveTo(rx + rw / 2, wbgCB - 20); ctx.lineTo(rx + rw / 2 - 5, wbgCB - 12); ctx.lineTo(rx + rw / 2 + 5, wbgCB - 12); ctx.fill()

        for (let i = 0; i < 8; i++) {
          const ex = rx + 10 + ((time * 0.8 + i * rw / 8) % rw)
          const ey = vbY - 12 - i * 3 - Math.abs(Math.sin(time * 0.06 + i)) * 8
          const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, 3)
          g.addColorStop(0, `rgba(0,229,255,${0.3 * fieldPulse})`); g.addColorStop(1, 'transparent')
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ex, ey, 3, 0, Math.PI * 2); ctx.fill()
        }
      } else {
        // idle: faint electrons in VB
        for (let i = 0; i < 4; i++) {
          const ex = rx + 10 + ((time * 0.15 + i * rw / 4) % rw)
          ctx.fillStyle = 'rgba(0,229,255,0.06)'
          ctx.beginPath(); ctx.arc(ex, vbY + 2, 2, 0, Math.PI * 2); ctx.fill()
        }
      }

      // Breakdown field comparison
      const bfY = H - 10
      ctx.fillStyle = 'rgba(0,229,255,0.15)'; ctx.font = '5px monospace'
      ctx.fillText('Ebd:', lx, bfY)
      ctx.fillStyle = 'rgba(0,229,255,0.15)'; ctx.fillRect(lx + 20, bfY - 2, 20, 3) // Si ~0.3
      ctx.fillStyle = 'rgba(0,230,118,0.25)'; ctx.fillRect(lx + 20, bfY - 2, 80, 3) // WBG ~10x

      animationIds[6] = requestAnimationFrame(frame)
    }
    frame()
  }

  // ====== 8. 高速接口 SerDes — 并行→串行 + 眼图 ======
  function startSerDes(cvs) {
    const ctx = initCanvas(cvs)
    let time = 0

    function frame() {
      time++; ctx.clearRect(0, 0, W, H)

      const rateLabel = time < 300 ? 'NRZ 56G' : time < 600 ? 'PAM4 112G' : 'PAM4 224G'

      // 8 parallel input lines
      const pStartX = 8, pLen = 45, pSpacing = 6
      for (let i = 0; i < 8; i++) {
        const py = 28 + i * pSpacing
        const level = Math.sin(time * 0.15 + i * 1.1) > 0 ? 1 : 0
        ctx.strokeStyle = 'rgba(0,229,255,0.08)'; ctx.lineWidth = 0.5
        ctx.beginPath(); ctx.moveTo(pStartX, py); ctx.lineTo(pStartX + pLen, py); ctx.stroke()
        // Data level
        if (level) {
          ctx.fillStyle = 'rgba(0,229,255,0.2)'
          ctx.fillRect(pStartX + pLen - 10, py - 1.5, 8, 3)
        }
      }

      // MUX funnel
      ctx.fillStyle = 'rgba(0,229,255,0.03)'
      ctx.beginPath(); ctx.moveTo(pStartX + pLen, 28); ctx.lineTo(pStartX + pLen + 30, 48)
      ctx.lineTo(pStartX + pLen + 30, 76); ctx.lineTo(pStartX + pLen, 28 + 7 * pSpacing)
      ctx.closePath(); ctx.fill()
      ctx.strokeStyle = 'rgba(0,229,255,0.08)'; ctx.lineWidth = 0.5; ctx.stroke()

      // Serial line
      const serStartX = pStartX + pLen + 30, serEndX = W - 10
      ctx.strokeStyle = 'rgba(0,229,255,0.06)'; ctx.lineWidth = 0.5
      ctx.beginPath(); ctx.moveTo(serStartX, 62); ctx.lineTo(serEndX, 62); ctx.stroke()

      // High-speed serial waveform
      ctx.strokeStyle = 'rgba(0,229,255,0.25)'; ctx.lineWidth = 1
      ctx.beginPath()
      const waveY = 62, waveAmp = 12
      for (let x = serStartX; x < serEndX; x++) {
        const t = (x - serStartX) / (serEndX - serStartX) * 8
        const val = Math.sin(t * Math.PI * 2 + time * 0.4) * 0.8
        const y4 = Math.round((val + 1) / 2 * 3) / 3 * 2 - 1 // PAM4 discretization
        const y = waveY - y4 * waveAmp / 2
        if (x === serStartX) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Eye diagram (bottom)
      const eyeX = 30, eyeW = W - 50, eyeH = 50, eyeY = H - 60
      ctx.strokeStyle = 'rgba(0,229,255,0.06)'; ctx.lineWidth = 0.5
      ctx.strokeRect(eyeX, eyeY, eyeW, eyeH)

      // Eye opening varies: initially closed, opens with EQ
      const eyeCycle = (time % 500) / 500
      const eyeOpen = eyeCycle < 0.3 ? eyeCycle / 0.3 : 1 // opens over first 30%, then stays open
      const eyeInnerH = eyeH * 0.55 * eyeOpen
      const eyeInnerW = eyeW * 0.35 * eyeOpen
      const eyeCenterX = eyeX + eyeW / 2, eyeCenterY = eyeY + eyeH / 2

      // Draw eye shape (multiple overlaid waveforms)
      for (let trace = 0; trace < 8; trace++) {
        const phaseOffset = trace * 0.15
        ctx.strokeStyle = `rgba(0,229,255,${0.04 + eyeOpen * 0.06})`; ctx.lineWidth = 0.6
        ctx.beginPath()
        for (let i = 0; i <= 60; i++) {
          const t = (i / 60) * Math.PI * 2
          const x = eyeCenterX + Math.cos(t + phaseOffset) * eyeW / 2
          const y = eyeCenterY - Math.sin(t + phaseOffset) * (eyeH / 2) * (0.3 + eyeOpen * 0.65)
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // Eye inner highlight
      if (eyeOpen > 0.5) {
        const g = ctx.createRadialGradient(eyeCenterX, eyeCenterY, 0, eyeCenterX, eyeCenterY, eyeInnerW)
        g.addColorStop(0, `rgba(0,230,118,${0.05 * (eyeOpen - 0.5) * 2})`)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g; ctx.fillRect(eyeCenterX - eyeInnerW, eyeCenterY - eyeInnerH, eyeInnerW * 2, eyeInnerH * 2)
      }

      // EQ indicator
      const eqProgress = eyeOpen
      ctx.fillStyle = 'rgba(124,77,255,0.2)'; ctx.font = '5px monospace'
      ctx.fillText('CTLE+DFE', eyeX + eyeW + 2, eyeY + 10)
      ctx.fillRect(eyeX + eyeW + 2, eyeY + 12, 10, eyeH - 12)
      ctx.fillStyle = `rgba(0,229,255,${0.3 * eqProgress})`
      ctx.fillRect(eyeX + eyeW + 2, eyeY + 12 + (eyeH - 12) * (1 - eqProgress), 10, (eyeH - 12) * eqProgress)

      // Rate label
      ctx.fillStyle = 'rgba(0,229,255,0.4)'; ctx.font = '7px monospace'
      ctx.fillText(rateLabel, W - 58, 18)

      animationIds[7] = requestAnimationFrame(frame)
    }
    frame()
  }

  // ====== 9. PMIC — Buck 转换器电路 ======
  function startPMIC(cvs) {
    const ctx = initCanvas(cvs)
    let time = 0
    const sx = 30, swY = 75, Lx = 90, cx = 140, outX = 180

    function frame() {
      time++; ctx.clearRect(0, 0, W, H)

      const duty = 0.45, period = 60
      const swOn = (time % period) / period < duty

      // Vin source
      ctx.fillStyle = 'rgba(0,229,255,0.12)'; ctx.fillRect(sx - 20, 30, 18, 40)
      ctx.fillStyle = 'rgba(0,229,255,0.35)'; ctx.font = '6px monospace'
      ctx.fillText('Vin', sx - 14, 28)

      // SW node
      const swAlpha = swOn ? 0.35 : 0.08
      ctx.fillStyle = `rgba(0,229,255,${swAlpha})`; ctx.fillRect(sx - 2, swY - 4, 8, 16)
      ctx.fillText('SW', sx - 1, swY - 8)

      // Inductor (coil symbol)
      ctx.strokeStyle = 'rgba(0,229,255,0.15)'; ctx.lineWidth = 1
      const coilX = Lx - 10, coilY = swY
      ctx.beginPath()
      for (let c = 0; c < 5; c++) {
        const cx2 = coilX + c * 6, cy2 = coilY + (c % 2 === 0 ? -5 : 5)
        if (c === 0) ctx.moveTo(cx2, cy2)
        else ctx.quadraticCurveTo(cx2 - 3, cy2 + (c % 2 === 0 ? 8 : -8), cx2, cy2)
      }
      ctx.stroke()
      ctx.fillStyle = 'rgba(0,229,255,0.25)'; ctx.font = '6px monospace'
      ctx.fillText('L', coilX + 15, coilY - 10)

      // Inductor current waveform (mini scope)
      const scopeX = Lx, scopeY = swY - 28, scopeW = 55, scopeH = 20
      ctx.strokeStyle = 'rgba(0,229,255,0.08)'; ctx.lineWidth = 0.5
      ctx.strokeRect(scopeX, scopeY, scopeW, scopeH)
      ctx.strokeStyle = 'rgba(0,229,255,0.3)'; ctx.lineWidth = 1
      ctx.beginPath()
      for (let i = 0; i <= scopeW; i++) {
        const t = (time % period) / period + i / scopeW * 0.8
        const frac = t % 1
        const iL = frac < duty ? frac / duty : 1 - (frac - duty) / (1 - duty)
        const y = scopeY + scopeH - iL * scopeH * 0.8
        if (i === 0) ctx.moveTo(scopeX + i, y); else ctx.lineTo(scopeX + i, y)
      }
      ctx.stroke()
      ctx.fillStyle = 'rgba(0,229,255,0.18)'; ctx.font = '5px monospace'
      ctx.fillText('I_L', scopeX + scopeW + 2, scopeY + scopeH / 2 + 2)

      // Capacitor
      ctx.strokeStyle = 'rgba(0,229,255,0.12)'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(cx - 8, swY - 12); ctx.lineTo(cx - 8, swY + 12); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx + 8, swY - 12); ctx.lineTo(cx + 8, swY + 12); ctx.stroke()
      ctx.fillStyle = 'rgba(0,229,255,0.2)'; ctx.font = '6px monospace'
      ctx.fillText('C', cx + 12, swY + 4)

      // Diode
      ctx.fillStyle = 'rgba(0,229,255,0.08)'
      ctx.beginPath(); ctx.moveTo(Lx - 15, swY + 16); ctx.lineTo(Lx + 25, swY + 32)
      ctx.lineTo(Lx + 25, swY + 28); ctx.lineTo(Lx - 10, swY + 12); ctx.closePath(); ctx.fill()
      ctx.fillStyle = 'rgba(0,229,255,0.2)'; ctx.font = '5px monospace'
      ctx.fillText('D', Lx, swY + 34)

      // Output
      ctx.fillStyle = swOn ? 'rgba(0,230,118,0.5)' : 'rgba(0,230,118,0.3)'
      ctx.font = 'bold 9px monospace'
      const vout = (1.0 + Math.sin(time * 0.02) * 0.003).toFixed(3)
      ctx.fillText(`Vout: ${vout}V`, outX - 5, swY + 4)

      // Load
      ctx.fillStyle = 'rgba(0,229,255,0.08)'; ctx.fillRect(outX + 45, swY - 18, 18, 36)
      ctx.fillStyle = 'rgba(0,229,255,0.2)'; ctx.font = '5px monospace'
      ctx.fillText('Load', outX + 42, swY - 20)

      // Efficiency
      const eff = (92.5 + Math.sin(time * 0.03) * 1.8).toFixed(1)
      ctx.fillStyle = 'rgba(0,229,255,0.35)'; ctx.font = '6px monospace'
      ctx.fillText(`η: ${eff}%`, outX - 5, H - 12)

      // Circuit lines
      ctx.strokeStyle = 'rgba(0,229,255,0.08)'; ctx.lineWidth = 0.6
      ctx.beginPath(); ctx.moveTo(sx - 20 + 18, 50); ctx.lineTo(sx - 2, swY + 3); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(sx + 6, swY + 3); ctx.lineTo(Lx - 10, swY + 3); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(Lx + 20, swY + 3); ctx.lineTo(cx - 8, swY + 3); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx + 8, swY + 3); ctx.lineTo(outX, swY + 3); ctx.stroke()
      // Ground
      ctx.strokeStyle = 'rgba(0,229,255,0.1)'; ctx.lineWidth = 0.8
      ctx.beginPath(); ctx.moveTo(Lx - 5, swY + 34); ctx.lineTo(Lx - 5, swY + 44); ctx.moveTo(Lx - 10, swY + 44); ctx.lineTo(Lx, swY + 44); ctx.stroke()

      // Phase count indicator
      const phaseCount = 1 + Math.floor(time / 150) % 4
      if (phaseCount > 1) {
        ctx.fillStyle = 'rgba(0,229,255,0.2)'; ctx.font = '5px monospace'
        ctx.fillText(`×${phaseCount} phase`, sx - 10, H - 6)
      }

      animationIds[8] = requestAnimationFrame(frame)
    }
    frame()
  }

  // ====== 10. RISC-V — 5 级流水线 + 前推 ======
  function startRISC(cvs) {
    const ctx = initCanvas(cvs)
    let time = 0
    const stages = ['IF', 'ID', 'EX', 'MEM', 'WB']
    const stageW = 40, stageH = 24, gap = 8
    const totalW = stages.length * (stageW + gap) - gap
    const startX = (W - totalW) / 2
    const stageY = 60

    const stageColors = [185, 200, 250, 270, 140] // hue per stage
    let instructions = []
    let nextInsnId = 0

    function frame() {
      time++; ctx.clearRect(0, 0, W, H)

      // Issue new instruction every 22 frames (occasionally stall: every ~100 frames)
      const isStall = time % 100 > 90
      if (time % 22 === 0 && !isStall) {
        instructions.push({ id: nextInsnId++, stage: 0, x: startX })
      }
      // Advance pipeline
      if (time % 22 === 0) {
        instructions.forEach(ins => { if (ins.stage < stages.length) ins.stage++ })
        instructions = instructions.filter(ins => ins.stage < stages.length)
      }

      // Stage boxes
      stages.forEach((s, i) => {
        const sx = startX + i * (stageW + gap)
        ctx.fillStyle = `hsla(${stageColors[i]},70%,55%,0.08)`
        ctx.fillRect(sx, stageY, stageW, stageH)
        ctx.strokeStyle = `hsla(${stageColors[i]},70%,60%,0.2)`; ctx.lineWidth = 0.7
        ctx.strokeRect(sx, stageY, stageW, stageH)
        ctx.fillStyle = `hsla(${stageColors[i]},70%,65%,0.4)`; ctx.font = 'bold 7px monospace'
        ctx.fillText(s, sx + stageW / 2 - ctx.measureText(s).width / 2, stageY + stageH / 2 + 3)
      })

      // Instructions
      instructions.forEach(ins => {
        const sx = startX + ins.stage * (stageW + gap)
        const alpha = 0.3 + Math.sin(time * 0.06 + ins.id) * 0.1
        ctx.fillStyle = `rgba(0,229,255,${alpha})`
        ctx.fillRect(sx + 2, stageY + stageH + 6, stageW - 4, 10)
        ctx.fillStyle = 'rgba(0,229,255,0.6)'; ctx.font = '5px monospace'
        const label = `I${ins.id}`
        ctx.fillText(label, sx + stageW / 2 - ctx.measureText(label).width / 2, stageY + stageH + 14)
      })

      // Forwarding path (EX→EX bypass, only when two instructions span EX & ID)
      const exIns = instructions.filter(ins => ins.stage === 2).slice(-1)
      const idIns = instructions.filter(ins => ins.stage === 1).slice(-1)
      if (exIns.length && idIns.length && Math.abs(exIns[0].id - idIns[0].id) <= 2) {
        const exSx = startX + 2 * (stageW + gap) + stageW / 2
        const idSx = startX + 1 * (stageW + gap) + stageW / 2
        const arcY = stageY - 18
        ctx.strokeStyle = `rgba(124,77,255,${0.1 + Math.sin(time * 0.1) * 0.04})`; ctx.lineWidth = 1
        ctx.setLineDash([3, 2])
        ctx.beginPath(); ctx.moveTo(exSx, stageY)
        ctx.bezierCurveTo(exSx, arcY, idSx, arcY, idSx, stageY)
        ctx.stroke()
        ctx.setLineDash([])
        // forwarding label
        ctx.fillStyle = 'rgba(124,77,255,0.3)'; ctx.font = '5px monospace'
        ctx.fillText('fwd', (exSx + idSx) / 2 - 8, arcY - 2)
      }

      // Stall indicator
      if (isStall) {
        const idSx = startX + 1 * (stageW + gap)
        ctx.strokeStyle = `rgba(255,50,50,${0.12 + Math.sin(time * 0.3) * 0.06})`; ctx.lineWidth = 1.2
        ctx.strokeRect(idSx - 1, stageY - 1, stageW + 2, stageH + 2)
        ctx.fillStyle = 'rgba(255,50,50,0.2)'; ctx.font = '5px monospace'
        ctx.fillText('STALL', idSx + stageW / 2 - 12, stageY - 6)
      }

      // Pipeline arrow
      ctx.strokeStyle = 'rgba(0,229,255,0.08)'; ctx.lineWidth = 0.8
      ctx.beginPath(); ctx.moveTo(startX, stageY + stageH + 22); ctx.lineTo(startX + totalW, stageY + stageH + 22); ctx.stroke()
      ctx.fillStyle = 'rgba(0,229,255,0.15)'; ctx.beginPath()
      ctx.moveTo(startX + totalW, stageY + stageH + 22); ctx.lineTo(startX + totalW - 5, stageY + stageH + 19); ctx.lineTo(startX + totalW - 5, stageY + stageH + 25); ctx.fill()

      // ISA string
      ctx.fillStyle = 'rgba(0,229,255,0.3)'; ctx.font = '6px monospace'
      ctx.fillText('RV64IMAFDC', startX + totalW / 2 - 30, H - 10)

      // Highlight active extension
      const extIdx = Math.floor(time / 70) % 7
      const extLetters = ['R', 'V', '6', '4', 'I', 'M', 'A', 'F', 'D', 'C']
      // just cycle through highlighting individual chars of the RV64IMAFDC label
      const rvStr = 'RV64IMAFDC'
      ctx.fillStyle = 'rgba(0,229,255,0.55)'; ctx.font = '6px monospace'
      ctx.fillText(rvStr[extIdx % rvStr.length] || '', startX + totalW / 2 - 30 + (extIdx % rvStr.length) * 4, H - 10)

      animationIds[9] = requestAnimationFrame(frame)
    }
    frame()
  }

  // ====== 11. AI处理器架构 — Systolic Array ======
  function startSystolic(cvs) {
    const ctx = initCanvas(cvs)
    let time = 0
    const rows = 5, cols = 7
    const cellSz = 18, gap = 3
    const gridW = cols * (cellSz + gap) - gap, gridH = rows * (cellSz + gap) - gap
    const gx = (W - gridW) / 2 + 10, gy = 25

    function frame() {
      time++; ctx.clearRect(0, 0, W, H)

      // Title
      ctx.fillStyle = 'rgba(0,229,255,0.25)'; ctx.font = '6px monospace'
      ctx.fillText('Systolic Array', gx - 4, gy - 5)

      // Grid cells
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = gx + c * (cellSz + gap), cy = gy + r * (cellSz + gap)
          ctx.fillStyle = 'rgba(0,229,255,0.03)'
          ctx.fillRect(cx, cy, cellSz, cellSz)
          ctx.strokeStyle = 'rgba(0,229,255,0.06)'; ctx.lineWidth = 0.4
          ctx.strokeRect(cx, cy, cellSz, cellSz)

          // Cell accumulation glow
          const acc = 0.3 + Math.sin(time * 0.03 + r * 0.5 + c * 0.7) * 0.2
          if (acc > 0.38) {
            const g = ctx.createRadialGradient(cx + cellSz / 2, cy + cellSz / 2, 0, cx + cellSz / 2, cy + cellSz / 2, cellSz)
            g.addColorStop(0, `rgba(0,229,255,${0.06 * acc})`); g.addColorStop(1, 'transparent')
            ctx.fillStyle = g; ctx.fillRect(cx, cy, cellSz, cellSz)
          }
        }
      }

      // Weight flow (horizontal, purple cubes) — one per row
      for (let r = 0; r < rows; r++) {
        const wPhase = ((time * 0.07 + r * 0.4) % (cols + 2)) - 1
        if (wPhase < 0 || wPhase >= cols) continue
        const cx = gx + wPhase * (cellSz + gap), cy = gy + r * (cellSz + gap)
        ctx.fillStyle = 'rgba(124,77,255,0.25)'
        ctx.fillRect(cx + 3, cy + 3, cellSz - 6, cellSz - 6)
        const g = ctx.createRadialGradient(cx + cellSz / 2, cy + cellSz / 2, 0, cx + cellSz / 2, cy + cellSz / 2, cellSz / 2)
        g.addColorStop(0, 'rgba(124,77,255,0.3)'); g.addColorStop(1, 'transparent')
        ctx.fillStyle = g; ctx.fillRect(cx, cy, cellSz, cellSz)
      }

      // Activation flow (vertical, cyan cubes) — one per column
      for (let c = 0; c < cols; c++) {
        const aPhase = ((time * 0.06 + c * 0.5) % (rows + 2)) - 1
        if (aPhase < 0 || aPhase >= rows) continue
        const cx = gx + c * (cellSz + gap), cy = gy + aPhase * (cellSz + gap)
        ctx.fillStyle = 'rgba(0,229,255,0.25)'
        ctx.fillRect(cx + 3, cy + 3, cellSz - 6, cellSz - 6)
        const g = ctx.createRadialGradient(cx + cellSz / 2, cy + cellSz / 2, 0, cx + cellSz / 2, cy + cellSz / 2, cellSz / 2)
        g.addColorStop(0, 'rgba(0,229,255,0.3)'); g.addColorStop(1, 'transparent')
        ctx.fillStyle = g; ctx.fillRect(cx, cy, cellSz, cellSz)
      }

      // MAC meeting flash
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const wPhase = ((time * 0.07 + r * 0.4) % (cols + 2)) - 1
          const aPhase = ((time * 0.06 + c * 0.5) % (rows + 2)) - 1
          if (Math.abs(wPhase - c) < 0.15 && Math.abs(aPhase - r) < 0.15) {
            const cx = gx + c * (cellSz + gap) + cellSz / 2
            const cy = gy + r * (cellSz + gap) + cellSz / 2
            const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, cellSz)
            g.addColorStop(0, 'rgba(255,255,255,0.25)'); g.addColorStop(0.3, 'rgba(0,229,255,0.15)'); g.addColorStop(1, 'transparent')
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, cellSz, 0, Math.PI * 2); ctx.fill()
          }
        }
      }

      // Accumulators at bottom
      const accY = gy + gridH + 8
      for (let c = 0; c < cols; c++) {
        const ax = gx + c * (cellSz + gap)
        const accVal = 0.3 + Math.sin(time * 0.04 + c * 0.9) * 0.2
        ctx.fillStyle = `rgba(0,230,118,${0.08 + accVal * 0.15})`
        ctx.fillRect(ax, accY, cellSz, 5)
        ctx.strokeStyle = 'rgba(0,229,255,0.1)'; ctx.lineWidth = 0.3
        ctx.strokeRect(ax, accY, cellSz, 5)
      }
      ctx.fillStyle = 'rgba(0,229,255,0.2)'; ctx.font = '5px monospace'
      ctx.fillText('Accumulators', gx, accY + 12)

      // Sparse indicator
      const sparseRatio = 0.3 + Math.abs(Math.sin(time * 0.02)) * 0.4
      ctx.fillStyle = 'rgba(0,229,255,0.3)'; ctx.font = '6px monospace'
      ctx.fillText(`Sparse ${Math.round(sparseRatio * 100)}%`, gx + gridW - 55, gy - 5)
      ctx.fillText('INT8 MAC', gx + gridW - 55, accY + 12)

      animationIds[10] = requestAnimationFrame(frame)
    }
    frame()
  }

  // ====== 12. 神经形态计算芯片 — SNN ======
  function startNeuromorphic(cvs) {
    const ctx = initCanvas(cvs)
    let time = 0

    // Neuron network topology
    const neurons = [
      { x: 40, y: 30, thresh: 80 + Math.random() * 50 },
      { x: 40, y: 80, thresh: 80 + Math.random() * 50 },
      { x: 40, y: 140, thresh: 80 + Math.random() * 50 },
      { x: 100, y: 30, thresh: 80 + Math.random() * 50 },
      { x: 100, y: 80, thresh: 80 + Math.random() * 50 },
      { x: 100, y: 140, thresh: 80 + Math.random() * 50 },
      { x: 150, y: 55, thresh: 80 + Math.random() * 50 },
      { x: 150, y: 105, thresh: 80 + Math.random() * 50 },
      { x: 195, y: 30, thresh: 80 + Math.random() * 50 },
      { x: 195, y: 80, thresh: 80 + Math.random() * 50 },
      { x: 195, y: 140, thresh: 80 + Math.random() * 50 },
      { x: 230, y: 55, thresh: 80 + Math.random() * 50 },
      { x: 230, y: 105, thresh: 80 + Math.random() * 50 },
    ]

    // Connections (feedforward-ish with skip)
    const synapses = [
      [0, 3], [0, 4], [1, 4], [1, 5], [2, 4], [2, 5],
      [3, 6], [3, 7], [4, 6], [4, 7], [5, 6], [5, 7],
      [6, 8], [6, 9], [7, 9], [7, 10],
      [8, 11], [8, 12], [9, 11], [9, 12], [10, 12],
      [3, 7], [0, 5], // skips
    ]

    // Per-neuron state
    const state = neurons.map(n => ({
      v: 0, // membrane potential (0-1)
      refractory: 0,
      lastSpike: -100,
    }))

    // Active spikes in transit
    let spikes = []

    function frame() {
      time++; ctx.clearRect(0, 0, W, H)

      // Input stimulation every ~80 frames to random input neuron
      if (time % 80 === 0) {
        const inputIdx = Math.floor(Math.random() * 3) // neurons 0-2 are inputs
        state[inputIdx].v += 0.5
      }

      // Update neuron dynamics
      neurons.forEach((n, i) => {
        if (state[i].refractory > 0) {
          state[i].refractory--
          if (state[i].refractory === 0) state[i].v = 0
          return
        }
        // Leaky integration
        state[i].v *= 0.995
        // Check threshold
        if (state[i].v > 1.0) {
          state[i].v = 0
          state[i].refractory = 25
          state[i].lastSpike = time
          // Send spike to all downstream
          synapses.filter(s => s[0] === i).forEach(s => {
            const dst = s[1]
            spikes.push({ from: i, to: dst, start: time, duration: 18 })
          })
        }
      })

      // Deliver spikes
      const now = time
      spikes.forEach(s => {
        const elapsed = now - s.start
        if (elapsed === Math.floor(s.duration * 0.5)) {
          state[s.to].v += 0.22 + Math.random() * 0.08
        }
      })
      spikes = spikes.filter(s => now - s.start < s.duration)

      // Draw synapses
      synapses.forEach(s => {
        const a = neurons[s[0]], b = neurons[s[1]]
        const alpha = 0.03 + Math.sin(time * 0.02 + s[0] + s[1]) * 0.01
        ctx.strokeStyle = `rgba(0,229,255,${alpha})`; ctx.lineWidth = 0.4
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
      })

      // Draw neurons
      neurons.forEach((n, i) => {
        const { v, refractory } = state[i]
        const isRefractory = refractory > 0

        // Membrane potential glow
        const glowR = 3 + v * 10
        if (!isRefractory && v > 0.01) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR)
          g.addColorStop(0, `rgba(0,229,255,${0.1 + v * 0.15})`)
          g.addColorStop(1, 'transparent')
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2); ctx.fill()
        }

        // Refractory — dark purple
        if (isRefractory) {
          ctx.fillStyle = 'rgba(124,77,255,0.06)'
          ctx.beginPath(); ctx.arc(n.x, n.y, 6, 0, Math.PI * 2); ctx.fill()
        }

        // Neuron body
        const bodyAlpha = isRefractory ? 0.15 : 0.2 + v * 0.25
        const bodyHue = isRefractory ? 270 : 185
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 8)
        g.addColorStop(0, `hsla(${bodyHue},70%,60%,${bodyAlpha * 0.4})`)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(n.x, n.y, 8, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = `hsla(${bodyHue},70%,55%,${bodyAlpha})`
        ctx.beginPath(); ctx.arc(n.x, n.y, 3.5, 0, Math.PI * 2); ctx.fill()

        // Spike ring (near time of last spike)
        const sinceSpike = time - state[i].lastSpike
        if (sinceSpike < 15 && sinceSpike >= 0) {
          const ringR = 3 + sinceSpike * 2.5
          const ringAlpha = 0.4 * (1 - sinceSpike / 15)
          ctx.strokeStyle = `rgba(0,229,255,${ringAlpha})`; ctx.lineWidth = 1.5
          ctx.beginPath(); ctx.arc(n.x, n.y, ringR, 0, Math.PI * 2); ctx.stroke()
        }
      })

      // Draw spikes in transit
      spikes.forEach(s => {
        const a = neurons[s.from], b = neurons[s.to]
        const elapsed = now - s.start
        const t = elapsed / s.duration
        const px = a.x + (b.x - a.x) * t, py = a.y + (b.y - a.y) * t
        const spikeAlpha = 0.5 * (1 - Math.abs(t - 0.5) * 2)
        const g = ctx.createRadialGradient(px, py, 0, px, py, 5)
        g.addColorStop(0, `rgba(0,229,255,${spikeAlpha})`); g.addColorStop(1, 'transparent')
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill()
      })

      // Labels
      ctx.fillStyle = 'rgba(0,229,255,0.3)'; ctx.font = '6px monospace'
      ctx.fillText('Leaky I&F', 8, H - 12)
      ctx.fillText('Event-driven', W - 62, H - 12)
      // Power estimate
      const avgRate = spikes.length / 2
      ctx.fillStyle = 'rgba(0,230,118,0.3)'; ctx.font = '6px monospace'
      ctx.fillText(`~${(avgRate * 0.3 + 0.1).toFixed(1)} pJ/spike`, 8, H - 25)

      animationIds[11] = requestAnimationFrame(frame)
    }
    frame()
  }

  // 启动所有动画
  const starters = [startTransistor, start2DMaterial, startSpintronics, startChiplet, startHBM, startEDA, startWBG, startSerDes, startPMIC, startRISC, startSystolic, startNeuromorphic]
  nextTick(() => {
    const canvases = gridRef.value && gridRef.value.querySelectorAll('canvas')
    if (canvases && canvases.length) {
      starters.forEach((fn, i) => {
        if (!canvases[i]) return
        try {
          fn(canvases[i])
        } catch (e) {
          console.error(`[TechShowcase] Animation ${i} (${techs[i]?.name}) failed:`, e)
        }
      })
    }
  })
})

onUnmounted(() => {
  animationIds.forEach(id => cancelAnimationFrame(id))
})
</script>

<style scoped>
.tech-showcase {
  max-width: 1200px;
  margin: 1rem auto 3rem;
  padding: 0 1.5rem;
}

.tech-showcase-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  animation: title-in 0.8s ease-out 0.5s both;
}

@keyframes title-in {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.tech-title-text {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(0, 229, 255, 0.6);
  white-space: nowrap;
  animation: title-text-glow 4s ease-in-out infinite;
}

@keyframes title-text-glow {
  0%, 100% { text-shadow: 0 0 0 transparent; }
  50% { text-shadow: 0 0 12px rgba(0, 229, 255, 0.3); }
}

.tech-title-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(0, 229, 255, 0.3), transparent);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(265px, 1fr));
  gap: 1.2rem;
}

.tech-card {
  display: block;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0, 229, 255, 0.1);
  background: rgba(10, 15, 30, 0.4);
  backdrop-filter: blur(12px);
  transition: all 0.4s ease;
  animation: card-in 0.7s ease-out both;
}

.tech-card:nth-child(1) { animation-delay: 0.6s; }
.tech-card:nth-child(2) { animation-delay: 0.72s; }
.tech-card:nth-child(3) { animation-delay: 0.84s; }
.tech-card:nth-child(4) { animation-delay: 0.96s; }
.tech-card:nth-child(5) { animation-delay: 1.08s; }
.tech-card:nth-child(6) { animation-delay: 1.2s; }
.tech-card:nth-child(7) { animation-delay: 1.32s; }
.tech-card:nth-child(8) { animation-delay: 1.44s; }
.tech-card:nth-child(9) { animation-delay: 1.56s; }
.tech-card:nth-child(10) { animation-delay: 1.68s; }
.tech-card:nth-child(11) { animation-delay: 1.80s; }
.tech-card:nth-child(12) { animation-delay: 1.92s; }

@keyframes card-in {
  from { opacity: 0; transform: translateY(30px) scale(0.95); filter: blur(6px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}

.tech-card::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.4), rgba(124, 77, 255, 0.4), transparent);
  background-size: 200% 100%;
  animation: scan-border 3s linear infinite;
}

@keyframes scan-border {
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
}

.tech-card:hover {
  border-color: rgba(0, 229, 255, 0.25);
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.08), 0 15px 30px -10px rgba(0, 0, 0, 0.3);
  transform: translateY(-4px);
}

.tech-canvas { width: 100%; display: block; }

.tech-info {
  padding: 0.8rem 1rem;
  border-top: 1px solid rgba(0, 229, 255, 0.06);
}

.tech-name {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: rgba(0, 229, 255, 0.8);
  margin-bottom: 0.2rem;
  animation: name-glow 5s ease-in-out infinite;
}

.tech-card:nth-child(1) .tech-name { animation-delay: 0s; }
.tech-card:nth-child(2) .tech-name { animation-delay: 0.6s; }
.tech-card:nth-child(3) .tech-name { animation-delay: 1.2s; }
.tech-card:nth-child(4) .tech-name { animation-delay: 1.8s; }
.tech-card:nth-child(5) .tech-name { animation-delay: 2.4s; }
.tech-card:nth-child(6) .tech-name { animation-delay: 3.0s; }
.tech-card:nth-child(7) .tech-name { animation-delay: 3.6s; }
.tech-card:nth-child(8) .tech-name { animation-delay: 4.2s; }
.tech-card:nth-child(9) .tech-name { animation-delay: 4.8s; }
.tech-card:nth-child(10) .tech-name { animation-delay: 5.4s; }
.tech-card:nth-child(11) .tech-name { animation-delay: 6.0s; }
.tech-card:nth-child(12) .tech-name { animation-delay: 6.6s; }

@keyframes name-glow {
  0%, 100% { text-shadow: 0 0 0 transparent; }
  50% { text-shadow: 0 0 8px rgba(0, 229, 255, 0.4); }
}

.tech-desc {
  display: block;
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-3);
}

:root:not(.dark) .tech-card {
  background: rgba(240, 245, 255, 0.6);
  border-color: rgba(0, 140, 200, 0.12);
}

@media (max-width: 640px) {
  .tech-grid { grid-template-columns: 1fr; }
}
</style>
