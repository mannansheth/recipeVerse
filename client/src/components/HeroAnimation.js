"use client"

import { useEffect, useRef } from "react"

export default function HeroAnimation() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Colors
    const primaryColor = "#f97316" // Orange for food
    const secondaryColor = "#3b82f6" // Blue for technology/AI
    const tertiaryColor = "#10b981" // Green for freshness

    // Animation elements
    const elements = []

    // Chef hat
    const chefHat = {
      x: canvas.width / 2,
      y: canvas.height / 2 - 50,
      scale: 0.8,
      rotation: 0,
      draw: () => {
        const hatWidth = 120 * chefHat.scale
        const hatHeight = 100 * chefHat.scale

        ctx.save()
        ctx.translate(chefHat.x, chefHat.y)
        ctx.rotate(chefHat.rotation)

        // Hat top
        ctx.fillStyle = "#fff"
        ctx.beginPath()
        ctx.ellipse(0, -hatHeight / 2, hatWidth / 2, hatHeight / 3, 0, 0, Math.PI * 2)
        ctx.fill()

        // Hat base
        ctx.fillStyle = "#fff"
        ctx.beginPath()
        ctx.rect(-hatWidth / 3, -hatHeight / 6, (2 * hatWidth) / 3, hatHeight / 3)
        ctx.fill()

        // Hat details - binary pattern
        ctx.fillStyle = secondaryColor
        ctx.globalAlpha = 0.2
        for (let i = 0; i < 10; i++) {
          const size = 5 * chefHat.scale
          const x = (Math.random() - 0.5) * hatWidth
          const y = (Math.random() - 0.5) * hatHeight
          ctx.fillText(Math.random() > 0.5 ? "1" : "0", x, y)
        }

        ctx.restore()
      },
      update: () => {
        chefHat.rotation = Math.sin(Date.now() / 3000) * 0.05
        chefHat.scale = 0.8 + Math.sin(Date.now() / 2000) * 0.05
      },
    }
    elements.push(chefHat)

    // Cooking utensils with digital effects
    const utensils = [
      { name: "Spoon", emoji: "🥄", color: primaryColor },
      { name: "Fork", emoji: "🍴", color: primaryColor },
      { name: "Knife", emoji: "🔪", color: primaryColor },
      { name: "Pot", emoji: "🍲", color: primaryColor },
      { name: "Pan", emoji: "🍳", color: primaryColor },
    ]

    for (let i = 0; i < 5; i++) {
      const utensil = utensils[i % utensils.length]
      elements.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 30 + Math.random() * 20,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        emoji: utensil.emoji,
        color: utensil.color,
        pulsePhase: Math.random() * Math.PI * 2,
        draw: function () {
          ctx.save()
          ctx.translate(this.x, this.y)
          ctx.rotate(this.rotation)

          // Draw utensil emoji
          ctx.font = `${this.size}px Arial`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(this.emoji, 0, 0)

          // Draw digital circuit effect around utensil
          ctx.strokeStyle = secondaryColor
          ctx.lineWidth = 1
          ctx.globalAlpha = 0.3 + Math.sin(this.pulsePhase + Date.now() / 1000) * 0.2

          const radius = this.size * 0.8
          ctx.beginPath()
          for (let j = 0; j < 3; j++) {
            const angle = (j / 3) * Math.PI * 2 + Date.now() / 2000
            const x1 = Math.cos(angle) * radius
            const y1 = Math.sin(angle) * radius
            const x2 = Math.cos(angle + Math.PI / 6) * radius
            const y2 = Math.sin(angle + Math.PI / 6) * radius
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
          }
          ctx.stroke()

          ctx.restore()
        },
        update: function () {
          this.x += this.speedX
          this.y += this.speedY
          this.rotation += this.rotationSpeed

          // Boundary check
          if (this.x < -this.size) this.x = canvas.width + this.size
          if (this.x > canvas.width + this.size) this.x = -this.size
          if (this.y < -this.size) this.y = canvas.height + this.size
          if (this.y > canvas.height + this.size) this.y = -this.size
        },
      })
    }

    // Food ingredients
    const ingredients = [
      { emoji: "🍎", name: "Apple" },
      { emoji: "🥑", name: "Avocado" },
      { emoji: "🥕", name: "Carrot" },
      { emoji: "🍅", name: "Tomato" },
      { emoji: "🧀", name: "Cheese" },
      { emoji: "🥦", name: "Broccoli" },
      { emoji: "🍗", name: "Chicken" },
      { emoji: "🍚", name: "Rice" },
    ]

    for (let i = 0; i < 8; i++) {
      const ingredient = ingredients[i % ingredients.length]
      elements.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 25 + Math.random() * 15,
        speedX: (Math.random() - 0.5) * 0.7,
        speedY: (Math.random() - 0.5) * 0.7,
        emoji: ingredient.emoji,
        name: ingredient.name,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        digitalEffect: Math.random() > 0.5,
        pulsePhase: Math.random() * Math.PI * 2,
        draw: function () {
          ctx.save()
          ctx.translate(this.x, this.y)
          ctx.rotate(this.rotation)

          // Draw ingredient emoji
          ctx.font = `${this.size}px Arial`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(this.emoji, 0, 0)

          // Digital transformation effect for some ingredients
          if (this.digitalEffect) {
            ctx.globalAlpha = 0.2 + Math.sin(this.pulsePhase + Date.now() / 1000) * 0.1
            ctx.strokeStyle = secondaryColor
            ctx.lineWidth = 2

            // Draw digital squares around the ingredient
            const size = this.size * 0.7
            ctx.strokeRect(-size / 2, -size / 2, size, size)

            // Draw scanning line
            const scanPos = (Math.sin(Date.now() / 1000 + this.pulsePhase) + 1) / 2
            ctx.beginPath()
            ctx.moveTo(-size / 2, -size / 2 + size * scanPos)
            ctx.lineTo(size / 2, -size / 2 + size * scanPos)
            ctx.stroke()
          }

          ctx.restore()
        },
        update: function () {
          this.x += this.speedX
          this.y += this.speedY
          this.rotation += this.rotationSpeed

          // Boundary check with bounce effect
          if (this.x < this.size) {
            this.x = this.size
            this.speedX *= -1
          }
          if (this.x > canvas.width - this.size) {
            this.x = canvas.width - this.size
            this.speedX *= -1
          }
          if (this.y < this.size) {
            this.y = this.size
            this.speedY *= -1
          }
          if (this.y > canvas.height - this.size) {
            this.y = canvas.height - this.size
            this.speedY *= -1
          }
        },
      })
    }

    // AI nodes and connections
    const nodes = []
    const connections = []

    // Create AI network nodes
    for (let i = 0; i < 15; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 2 + Math.random() * 3,
        color: secondaryColor,
        pulsePhase: Math.random() * Math.PI * 2,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
      })
    }

    // Create connections between nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() > 0.7) {
          connections.push({
            from: i,
            to: j,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.5 + Math.random() * 1.5,
          })
        }
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "rgba(255, 247, 237, 0.5)")
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw AI network
      // Draw connections
      connections.forEach((conn) => {
        const fromNode = nodes[conn.from]
        const toNode = nodes[conn.to]

        const dx = toNode.x - fromNode.x
        const dy = toNode.y - fromNode.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < canvas.width / 3) {
          // Pulse effect along the connection
          const pulsePos = (Math.sin((Date.now() / 1000) * conn.pulseSpeed + conn.pulsePhase) + 1) / 2
          const pulseX = fromNode.x + dx * pulsePos
          const pulseY = fromNode.y + dy * pulsePos

          // Draw line
          ctx.beginPath()
          ctx.moveTo(fromNode.x, fromNode.y)
          ctx.lineTo(toNode.x, toNode.y)
          ctx.strokeStyle = secondaryColor
          ctx.globalAlpha = 0.1
          ctx.lineWidth = 1
          ctx.stroke()

          // Draw pulse
          ctx.beginPath()
          ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2)
          ctx.fillStyle = secondaryColor
          ctx.globalAlpha = 0.5
          ctx.fill()
        }
      })

      // Draw nodes
      nodes.forEach((node) => {
        // Update position
        node.x += node.speedX
        node.y += node.speedY

        // Boundary check
        if (node.x < node.radius || node.x > canvas.width - node.radius) node.speedX *= -1
        if (node.y < node.radius || node.y > canvas.height - node.radius) node.speedY *= -1

        // Draw node
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.globalAlpha = 0.3 + Math.sin(Date.now() / 1000 + node.pulsePhase) * 0.2
        ctx.fill()
      })

      // Update and draw all elements
      elements.forEach((element) => {
        element.update()
        element.draw()
      })

      // Draw some binary/code particles
      ctx.font = "12px monospace"
      ctx.fillStyle = secondaryColor
      ctx.globalAlpha = 0.2
      for (let i = 0; i < 20; i++) {
        const x = ((Math.sin(Date.now() / 2000 + i) + 1) / 2) * canvas.width
        const y = ((Math.cos(Date.now() / 3000 + i) + 1) / 2) * canvas.height
        const digit = Math.random() > 0.7 ? "1" : "0"
        ctx.fillText(digit, x, y)
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "linear-gradient(to bottom, rgba(255,247,237,0.3), rgba(255,255,255,0))" }}
    />
  )
}

