<template>
  <div>
    <div class="shaking-box" ref="shakingBox" id="shakingBox">
      <canvas></canvas>      
    </div>
    <!-- <canvas class="shaking-box" ref="shakingBox"></canvas> -->
    <div class="begin">
      <button class="btn-begin">正在抽奖</button>
    </div>
    <div class="gift-box">
      <span class="gift-ball gift-ball-anim"></span>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'BallGamer',
    props: {

    },
    data(){
      return {
        balls:[],
        count: 0,
        limit: 10,
        maxRadius: 28,
        colors: ["#f18f14", "#cf1212", "#1f9dee", "#9c442c"],
        ifCollision: false,
        ifMove: true
      }
    },
    mounted(){
      this.width = this.$refs.shakingBox.offsetWidth
      this.height = this.$refs.shakingBox.offsetHeight

      const canvas = document.querySelector("canvas"),
        ctx = canvas.getContext("2d")

      canvas.width = this.width
      canvas.height = this.height
      
      canvas.addEventListener("contextmenu",e => {
        if(!e) e = window.event
        e.preventDefault()
        this.balls = []
      },false)
      
      let animate = () => {
        ctx.clearRect(0, 0, this.width, this.height)

        if(this.count < this.limit){
          // const ball = this.initBall(this.random(this.width),this.random(this.height))
          const ball = this.initBall(this.random(this.width),this.height)     
          this.balls.push(ball)
          this.count++        
        }

        //画个球
        for (const ball of this.balls) {
          let radius = ball.radius,
            radgradX = ball.x - radius*0.5,
            radgradY = ball.y - radius*0.5,
            radgradR1 = radius*0.02,
            radgradR2 = radius*2

          const radgrad = ctx.createRadialGradient(radgradX, radgradY, radgradR1, radgradX, radgradY, radgradR2)        
          radgrad.addColorStop(0, "#F7F7F7")
          radgrad.addColorStop(0.8, ball.color)
          radgrad.addColorStop(1, ball.color)

          ctx.fillStyle = radgrad
          ctx.shadowColor = "#403938"
          ctx.beginPath()
          ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false)
          ctx.shadowOffsetX = ball.radius * 0.08
          ctx.shadowOffsetY = ball.radius * 0.08
          ctx.shadowBlur = ball.radius * 0.2
          ctx.closePath()
          ctx.fill()
        }

        // this.ballBigger()      
        // this.ifMove ? this.ballMove() : null
        // this.ifCollision ? this.ballCollision() : null
        if(this.ifMove) this.ballMove()
        if(this.ifCollision) this.ballCollision()

        requestAnimationFrame(animate)
      }
      animate()
    },
    methods: {
      random: function(n){
        return Math.floor(Math.random()*n)
      },
      initBall: function(x,y){
        let ball = new Object
        //圆心坐标
        ball.x = x
        ball.y = y
        //移动速率
        ball.vx = 3*(Math.random() + Math.random() + Math.random() - 1)
        ball.vy = 3*(Math.random() + Math.random() + Math.random() - 1)
        //初始半径
        ball.radius = this.maxRadius
        ball.m = ball.radius*0.5
        //球体颜色
        ball.color = this.colors[this.random(this.colors.length)]
        return ball
      },
      ballBigger: function(){
        for (const ball of this.balls) {
          if (ball.radius < this.maxRadius) {
            ball.radius += 0.5;
          }
        }
      },
      ballCollision: function(){
        for (let i = 0; i < this.balls.length; i++) {
          const ball1 = this.balls[i]
          for (var j = i + 1; j < this.balls.length; j++) {
            const ball2 = this.balls[j]
            if (ball1.radius + ball2.radius >= this.maxRadius * 2) {
              let dx = ball1.x - ball2.x,
                dy = ball1.y - ball2.y,
              //圆心距离
                dds = dx * dx + dy * dy,
              //最小距离            
                dm = ball1.radius + ball2.radius,
                dms = dm * dm
              if (dds < dms) {
                let angle = Math.atan2(dy, dx),
                  dist = Math.sqrt(dds),
                  depth = (dist - dm) / dist
                
                ball1.x -= dx * depth * 0.5
                ball1.y -= dy * depth * 0.5
                ball2.x += dx * depth * 0.5
                ball2.y += dy * depth * 0.5

                let v1 = Math.sqrt(ball1.vx * ball1.vx + ball1.vy * ball1.vy),
                  v2 = Math.sqrt(ball2.vx * ball2.vx + ball2.vy * ball2.vy),

                  a1 = Math.atan2(ball1.vy, ball1.vx),
                  a2 = Math.atan2(ball2.vy, ball2.vx),

                  rvx1 = v1 * Math.cos(a1-angle),
                  rvy1 = v1 * Math.sin(a1-angle),
                  rvx2 = v2 * Math.cos(a2-angle),
                  rvy2 = v2 * Math.sin(a2-angle),

                  evx1 = ((ball1.m - ball2.m) * rvx1 + 2 * ball2.m * rvx2) / (ball1.m + ball2.m),
                  evx2 = ((ball2.m - ball1.m) * rvx2 + 2 * ball1.m * rvx1) / (ball1.m + ball2.m),
                  evy1 = rvy1,
                  evy2 = rvy2

                ball1.vx =  Math.cos(angle) * evx1 + Math.cos(angle + Math.PI/2) * evy1
                ball1.vy =  Math.sin(angle) * evx1 + Math.sin(angle + Math.PI/2) * evy1
                ball2.vx =  Math.cos(angle) * evx2 + Math.cos(angle + Math.PI/2) * evy2
                ball2.vy =  Math.sin(angle) * evx2 + Math.sin(angle + Math.PI/2) * evy2
              }
            }
          }
        }
      },
      ballMove: function(){
        for(const ball of this.balls){
          // let ball = this.balls[i]
          if(ball.radius >= this.maxRadius){
            ball.x += ball.vx
            ball.y += ball.vy
            if(ball.y > this.height/2){
              if (ball.x - ball.radius < 0 ) {
                ball.x = ball.radius; 
                ball.vx *= -1
              }
              if (ball.x + ball.radius > this.width) {
                ball.x = this.width - ball.radius; 
                ball.vx *= -1
              }
              if (ball.y - ball.radius < 0 ) {
                ball.y = ball.radius
                ball.vy *= -1
              }
              if (ball.y + ball.radius > this.height) {
                ball.y = this.height - ball.radius
                ball.vy *= -1
              }
            }else{
              ball.x += ball.vx
              ball.y += ball.vy
              const dx = this.width/2 - ball.x,
                dy = this.width/2 - ball.y,
                maxR =  this.width/2,
                dr = Math.sqrt((dx*dx + dy*dy))
              if(dr + ball.radius >= maxR){
                const angle = Math.atan2(dx,dy),
                  diff = dr + ball.radius - maxR;
                ball.x = ball.x + Math.sin(angle)*diff
                ball.y = ball.y + Math.cos(angle)*diff
                ball.x > this.width/2 ? [ball.vx, ball.vy] = [ball.vy, ball.vx]  : [ball.vx, ball.vy] = [ball.vy*-1, -ball.vx]
              }
            }
          }
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .shaking-box
    width 670px
    height 450px
    border-top-right-radius 335px
    border-top-left-radius 335px
    margin 20px auto 0
    // border-top-right-radius 220px
    // border-top-left-radius 220px
  .gift-box
    position absolute
    top 638px
    left 50%
    width 180px
    height 180px
    border-radius 90px
    margin-left -90px
    // overflow hidden
  .begin
    display flex
    justify-content center
    vertical-align middle
    position absolute
    top 380px
    left 50%
    width 226px
    height 226px
    border-radius 113px
    margin-left -113px
    background-color #7b2ad1
    .btn-begin
      width 174px
      height 174px
      margin-top 26px
      color: #ce9b00
      font-weight bold
      border-radius 100px
      border 6px solid #b860f4
      // background-color #fdba1b
      background radial-gradient(circle,#fee708,#fdba1b)
  .gift-ball
    display none
    width 180px
    height 180px
    border-radius 90px
    background-image url('../../assets/img/ball1.png')
    background-size 100%
    background-repeat no-repeat
  .gift-ball-anim 
    display block  
    animation: bounce 1000ms linear both;    
  @keyframes bounce {
    0% { transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, -100, 0, 1); }
    2.92% { transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, -45.073, 0, 1); }
    3.37% { transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, -38.29, 0, 1); }
    3.47% { transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, -36.865, 0, 1); }
    4.58% { transform: matrix3d(1, 0, 0, 0, 0, 2.061, 0, 0, 0, 0, 1, 0, 0, -22.883, 0, 1); }
    5.69% { transform: matrix3d(1, 0, 0, 0, 0, 2.321, 0, 0, 0, 0, 1, 0, 0, -12.184, 0, 1); }
    5.76% { transform: matrix3d(1, 0, 0, 0, 0, 2.32, 0, 0, 0, 0, 1, 0, 0, -11.589, 0, 1); }
    7.41% { transform: matrix3d(1, 0, 0, 0, 0, 1.99, 0, 0, 0, 0, 1, 0, 0, -1.268, 0, 1); }
    7.51% { transform: matrix3d(1, 0, 0, 0, 0, 1.961, 0, 0, 0, 0, 1, 0, 0, -0.818, 0, 1); }
    7.88% { transform: matrix3d(1.062, 0, 0, 0, 0, 1.771, 0, 0, 0, 0, 1, 0, 0, 0.669, 0, 1); }
    8.68% { transform: matrix3d(1.181, 0, 0, 0, 0, 1.408, 0, 0, 0, 0, 1, 0, 0, 3.215, 0, 1); }
    10.03% { transform: matrix3d(1.333, 0, 0, 0, 0, 0.982, 0, 0, 0, 0, 1, 0, 0, 5.618, 0, 1); }
    10.85% { transform: matrix3d(1.398, 0, 0, 0, 0, 0.822, 0, 0, 0, 0, 1, 0, 0, 6.204, 0, 1); }
    11.53% { transform: matrix3d(1.439, 0, 0, 0, 0, 0.732, 0, 0, 0, 0, 1, 0, 0, 6.331, 0, 1); }
    12.22% { transform: matrix3d(1.469, 0, 0, 0, 0, 0.672, 0, 0, 0, 0, 1, 0, 0, 6.206, 0, 1); }
    14.18% { transform: matrix3d(1.501, 0, 0, 0, 0, 0.612, 0, 0, 0, 0, 1, 0, 0, 5.018, 0, 1); }
    14.37% { transform: matrix3d(1.501, 0, 0, 0, 0, 0.612, 0, 0, 0, 0, 1, 0, 0, 4.868, 0, 1); }
    19.23% { transform: matrix3d(1.371, 0, 0, 0, 0, 0.737, 0, 0, 0, 0, 1, 0, 0, 1.285, 0, 1); }
    20.01% { transform: matrix3d(1.338, 0, 0, 0, 0, 0.763, 0, 0, 0, 0, 1, 0, 0, 0.908, 0, 1); }
    23.05% { transform: matrix3d(1.211, 0, 0, 0, 0, 0.856, 0, 0, 0, 0, 1, 0, 0, 0.012, 0, 1); }
    25.75% { transform: matrix3d(1.114, 0, 0, 0, 0, 0.923, 0, 0, 0, 0, 1, 0, 0, -0.236, 0, 1); }
    26.94% { transform: matrix3d(1.078, 0, 0, 0, 0, 0.947, 0, 0, 0, 0, 1, 0, 0, -0.253, 0, 1); }
    31.58% { transform: matrix3d(0.987, 0, 0, 0, 0, 1.009, 0, 0, 0, 0, 1, 0, 0, -0.135, 0, 1); }
    31.73% { transform: matrix3d(0.986, 0, 0, 0, 0, 1.01, 0, 0, 0, 0, 1, 0, 0, -0.131, 0, 1); }
    37.32% { transform: matrix3d(0.958, 0, 0, 0, 0, 1.029, 0, 0, 0, 0, 1, 0, 0, -0.01, 0, 1); }
    38.15% { transform: matrix3d(0.958, 0, 0, 0, 0, 1.029, 0, 0, 0, 0, 1, 0, 0, -0.003, 0, 1); }
    42.35% { transform: matrix3d(0.969, 0, 0, 0, 0, 1.022, 0, 0, 0, 0, 1, 0, 0, 0.01, 0, 1); }
    48.9% { transform: matrix3d(0.99, 0, 0, 0, 0, 1.007, 0, 0, 0, 0, 1, 0, 0, 0.003, 0, 1); }
    57.77% { transform: matrix3d(1.003, 0, 0, 0, 0, 0.998, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
    60.47% { transform: matrix3d(1.004, 0, 0, 0, 0, 0.998, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
    69.36% { transform: matrix3d(1.001, 0, 0, 0, 0, 0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
    83.61% { transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
    100% { transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  }
</style>
