<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
    <canvas v-show="!isCollapse" id="myCanvas" class="canvas_on" width="140" height="140" />
    <canvas v-show="isCollapse" id="myCanvas1" class="canvas_on" width="50" height="50" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
    components: { SidebarItem, Logo },
    computed: {
        ...mapGetters([
            'sidebar'
        ]),
        routes() {
            return this.$router.options.routes
        },
        activeMenu() {
            const route = this.$route
            const { meta, path } = route
            // if set path, the sidebar will highlight the path you set
            if (meta.activeMenu) {
                return meta.activeMenu
            }
            console.log(path)
            return path
        },
        showLogo() {
            return this.$store.state.settings.sidebarLogo
        },
        variables() {
            return variables
        },
        isCollapse() {
            return !this.sidebar.opened
        }
    },
    mounted() {
        this.draw_canvas()
        this.draw_canvas1()
    },
    methods: {
        draw_canvas() {
            const canvas = document.getElementById('myCanvas')
            const ctx = canvas.getContext('2d')
            const W = ctx.canvas.width
            const H = ctx.canvas.height
            let movex = 1
            let movey = 1
            function draw() {
                shadow()
                eye()
                fen()
                smile()
            }

            function smile() {
                ctx.beginPath()
                ctx.lineWidth = W / 25
                ctx.lineCap = 'round'
                ctx.arc(W / 2 + movex * 3 / 5, H * 7 / 11 + movey / 2, W / 8, Math.PI * 1 / 6, Math.PI * 5 / 6)
                ctx.stroke()
            }

            /**
             * 笑眼睛
             */
            function eye() {
                ctx.beginPath()
                ctx.lineWidth = W / 30
                ctx.arc(W * 7 / 11 + movex / 2, H * 2 / 5 + movey / 2, W / 16, 0, Math.PI * 2)
                ctx.closePath()
                ctx.fillStyle = '#ffffff'
                ctx.fill()
                ctx.stroke()
                ctx.beginPath()
                ctx.lineWidth = W / 30
                ctx.arc(W * 4 / 11 + movex / 2, H * 2 / 5 + movey / 2, W / 16, 0, Math.PI * 2)
                ctx.closePath()
                ctx.fillStyle = '#ffffff'
                ctx.fill()
                ctx.stroke()
            }

            /**
             * 腮红
             */
            function fen() {
                if (movex > 0) {
                    ctx.beginPath()
                    ctx.arc(W * 5 / 22 + movex * 4 / 5, H * 3 / 5 + movey * 4 / 5, W / 16, 0, Math.PI, true)
                    ctx.closePath()
                    ctx.fillStyle = '#f9a880'
                    ctx.fill()
                    ctx.beginPath()
                    ctx.arc(W * 17 / 22 + movex * 3 / 5, H * 3 / 5 + movey * 3 / 5, W / 16, 0, Math.PI, true)
                    ctx.closePath()
                    ctx.fillStyle = '#f9a880'
                    ctx.fill()
                } else {
                    ctx.beginPath()
                    ctx.arc(W * 5 / 22 + movex * 3 / 5, H * 3 / 5 + movey * 3 / 5, W / 16, 0, Math.PI, true)
                    ctx.closePath()
                    ctx.fillStyle = '#f9a880'
                    ctx.fill()
                    ctx.beginPath()
                    ctx.arc(W * 17 / 22 + movex * 4 / 5, H * 3 / 5 + movey * 4 / 5, W / 16, 0, Math.PI, true)
                    ctx.closePath()
                    ctx.fillStyle = '#f9a880'
                    ctx.fill()
                }
            }

            /**
             * 基础圆和阴影
             */
            function shadow() {
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.arc(W / 2, H / 2, H / 2 - 2, 0, Math.PI * 2)
                ctx.closePath()
                ctx.fillStyle = '#fcc56b'
                ctx.fill()
                ctx.stroke()
                ctx.beginPath()
                // 内圆弧
                // ctx.fillStyle = 'rgb(253, 223, 109)'
                if (movey > 0) {
                    ctx.arc(W / 2 + movex,
                        H / 2 + movey,
                        H / 2 - 2,
                        (2 * Math.PI -
                            Math.acos(
                                (Math.pow(movex, 2) + Math.pow(movey, 2)) /
                                (2 * (Math.pow(H / 2 - 2, 2))) - 1
                            )) / 2 +
                        Math.acos(
                            movex / Math.sqrt(Math.pow(movex, 2) + Math.pow(movey, 2))
                        )
                        , Math.acos(
                            (Math.pow(movex, 2) + Math.pow(movey, 2)) /
                        (2 * (Math.pow(H / 2 - 2, 2))) - 1
                        ) / 2 + Math.PI +
                        Math.acos(
                            movex / Math.sqrt(Math.pow(movex, 2) + Math.pow(movey, 2))
                        ))
                    ctx.arc(W / 2,
                        H / 2,
                        H / 2 - 2,
                        2 * Math.PI - Math.acos(
                            (Math.pow(movex, 2) + Math.pow(movey, 2)) /
                        (2 * (Math.pow(H / 2 - 2, 2))) - 1
                        ) / 2 +
                        Math.acos(
                            movex / Math.sqrt(Math.pow(movex, 2) + Math.pow(movey, 2))
                        ),
                        Math.acos(
                            (Math.pow(movex, 2) + Math.pow(movey, 2)) /
                            (2 * (Math.pow(H / 2 - 2, 2))) - 1
                        ) / 2 +
                        Math.acos(
                            movex / Math.sqrt(Math.pow(movex, 2) + Math.pow(movey, 2))
                        ))
                } else {
                    ctx.arc(W / 2 + movex,
                        H / 2 + movey,
                        H / 2 - 2,
                        Math.PI - Math.acos(
                            (Math.pow(movex, 2) + Math.pow(movey, 2)) /
                        (2 * (Math.pow(H / 2 - 2, 2))) - 1
                        ) / 2 -
                        Math.acos(
                            movex / Math.sqrt(Math.pow(movex, 2) + Math.pow(movey, 2))
                        ),
                        (
                            Math.acos(
                                (Math.pow(movex, 2) + Math.pow(movey, 2)) /
                                (2 * (Math.pow(H / 2 - 2, 2))) - 1
                            )) / 2 + Math.PI -
                        Math.acos(
                            movex / Math.sqrt(Math.pow(movex, 2) + Math.pow(movey, 2))
                        ))
                    ctx.arc(W / 2,
                        H / 2,
                        H / 2 - 2,
                        2 * Math.PI - Math.acos(
                            (Math.pow(movex, 2) + Math.pow(movey, 2)) /
                        (2 * (Math.pow(H / 2 - 2, 2))) - 1
                        ) / 2 -
                        Math.acos(
                            movex / Math.sqrt(Math.pow(movex, 2) + Math.pow(movey, 2))
                        ),
                        Math.acos(
                            (Math.pow(movex, 2) + Math.pow(movey, 2)) /
                            (2 * (Math.pow(H / 2 - 2, 2))) - 1
                        ) / 2 -
                        Math.acos(
                            movex / Math.sqrt(Math.pow(movex, 2) + Math.pow(movey, 2))
                        ))
                }
                ctx.closePath()
                ctx.fillStyle = '#fddf6d'
                ctx.fill()
            }

            /**
             * 动画渲染
             */
            function run() {
                ctx.clearRect(0, 0, 200, 100)
                draw()
                setTimeout(run, 1000 / 60)
            }

            /**
             * 鼠标监听
             */
            window.addEventListener('mousemove', (event) => {
                const e = event || window.event
                const x = e.clientX
                const y = e.clientY
                movex = (x / 200 - document.body.offsetWidth / 400) * 3
                movey = (y / 120 - document.body.offsetHeight / 240) * 3
            })

            // 开始！
            run()
        },
        draw_canvas1() {
            const canvas = document.getElementById('myCanvas1')
            const ctx = canvas.getContext('2d')
            const W = ctx.canvas.width
            const H = ctx.canvas.height
            let movex = 1
            let movey = 1
            function draw() {
                shadow()
                eye()
                fen()
                smile()
            }

            function smile() {
                ctx.beginPath()
                ctx.lineWidth = W / 25
                ctx.lineCap = 'round'
                ctx.arc(W / 2 + movex * 3 / 5, H * 7 / 11 + movey / 2, W / 8, Math.PI * 1 / 6, Math.PI * 5 / 6)
                ctx.stroke()
            }

            /**
             * 笑眼睛
             */
            function eye() {
                ctx.beginPath()
                ctx.lineWidth = W / 30
                ctx.arc(W * 7 / 11 + movex / 2, H * 2 / 5 + movey / 2, W / 16, 0, Math.PI * 2)
                ctx.closePath()
                ctx.fillStyle = '#ffffff'
                ctx.fill()
                ctx.stroke()
                ctx.beginPath()
                ctx.lineWidth = W / 30
                ctx.arc(W * 4 / 11 + movex / 2, H * 2 / 5 + movey / 2, W / 16, 0, Math.PI * 2)
                ctx.closePath()
                ctx.fillStyle = '#ffffff'
                ctx.fill()
                ctx.stroke()
            }

            /**
             * 腮红
             */
            function fen() {
                if (movex > 0) {
                    ctx.beginPath()
                    ctx.arc(W * 5 / 22 + movex * 4 / 5, H * 3 / 5 + movey * 4 / 5, W / 16, 0, Math.PI, true)
                    ctx.closePath()
                    ctx.fillStyle = '#f9a880'
                    ctx.fill()
                    ctx.beginPath()
                    ctx.arc(W * 17 / 22 + movex * 3 / 5, H * 3 / 5 + movey * 3 / 5, W / 16, 0, Math.PI, true)
                    ctx.closePath()
                    ctx.fillStyle = '#f9a880'
                    ctx.fill()
                } else {
                    ctx.beginPath()
                    ctx.arc(W * 5 / 22 + movex * 3 / 5, H * 3 / 5 + movey * 3 / 5, W / 16, 0, Math.PI, true)
                    ctx.closePath()
                    ctx.fillStyle = '#f9a880'
                    ctx.fill()
                    ctx.beginPath()
                    ctx.arc(W * 17 / 22 + movex * 4 / 5, H * 3 / 5 + movey * 4 / 5, W / 16, 0, Math.PI, true)
                    ctx.closePath()
                    ctx.fillStyle = '#f9a880'
                    ctx.fill()
                }
            }

            /**
             * 基础圆和阴影
             */
            function shadow() {
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.arc(W / 2, H / 2, H / 2 - 2, 0, Math.PI * 2)
                ctx.closePath()
                ctx.fillStyle = '#fcc56b'
                ctx.fill()
                ctx.stroke()
                ctx.beginPath()
                // 内圆弧
                // ctx.fillStyle = 'rgb(253, 223, 109)'
                if (movey > 0) {
                    ctx.arc(W / 2 + movex,
                        H / 2 + movey,
                        H / 2 - 2,
                        (2 * Math.PI -
                            Math.acos(
                                (Math.pow(movex, 2) + Math.pow(movey, 2)) /
                                (2 * (Math.pow(H / 2 - 2, 2))) - 1
                            )) / 2 +
                        Math.acos(
                            movex / Math.sqrt(Math.pow(movex, 2) + Math.pow(movey, 2))
                        )
                        , Math.acos(
                            (Math.pow(movex, 2) + Math.pow(movey, 2)) /
                        (2 * (Math.pow(H / 2 - 2, 2))) - 1
                        ) / 2 + Math.PI +
                        Math.acos(
                            movex / Math.sqrt(Math.pow(movex, 2) + Math.pow(movey, 2))
                        ))
                    ctx.arc(W / 2,
                        H / 2,
                        H / 2 - 2,
                        2 * Math.PI - Math.acos(
                            (Math.pow(movex, 2) + Math.pow(movey, 2)) /
                        (2 * (Math.pow(H / 2 - 2, 2))) - 1
                        ) / 2 +
                        Math.acos(
                            movex / Math.sqrt(Math.pow(movex, 2) + Math.pow(movey, 2))
                        ),
                        Math.acos(
                            (Math.pow(movex, 2) + Math.pow(movey, 2)) /
                            (2 * (Math.pow(H / 2 - 2, 2))) - 1
                        ) / 2 +
                        Math.acos(
                            movex / Math.sqrt(Math.pow(movex, 2) + Math.pow(movey, 2))
                        ))
                } else {
                    ctx.arc(W / 2 + movex,
                        H / 2 + movey,
                        H / 2 - 2,
                        Math.PI - Math.acos(
                            (Math.pow(movex, 2) + Math.pow(movey, 2)) /
                        (2 * (Math.pow(H / 2 - 2, 2))) - 1
                        ) / 2 -
                        Math.acos(
                            movex / Math.sqrt(Math.pow(movex, 2) + Math.pow(movey, 2))
                        ),
                        (
                            Math.acos(
                                (Math.pow(movex, 2) + Math.pow(movey, 2)) /
                                (2 * (Math.pow(H / 2 - 2, 2))) - 1
                            )) / 2 + Math.PI -
                        Math.acos(
                            movex / Math.sqrt(Math.pow(movex, 2) + Math.pow(movey, 2))
                        ))
                    ctx.arc(W / 2,
                        H / 2,
                        H / 2 - 2,
                        2 * Math.PI - Math.acos(
                            (Math.pow(movex, 2) + Math.pow(movey, 2)) /
                        (2 * (Math.pow(H / 2 - 2, 2))) - 1
                        ) / 2 -
                        Math.acos(
                            movex / Math.sqrt(Math.pow(movex, 2) + Math.pow(movey, 2))
                        ),
                        Math.acos(
                            (Math.pow(movex, 2) + Math.pow(movey, 2)) /
                            (2 * (Math.pow(H / 2 - 2, 2))) - 1
                        ) / 2 -
                        Math.acos(
                            movex / Math.sqrt(Math.pow(movex, 2) + Math.pow(movey, 2))
                        ))
                }
                ctx.closePath()
                ctx.fillStyle = '#fddf6d'
                ctx.fill()
            }

            /**
             * 动画渲染
             */
            function run() {
                ctx.clearRect(0, 0, 200, 100)
                draw()
                setTimeout(run, 1000 / 60)
            }

            /**
             * 鼠标监听
             */
            window.addEventListener('mousemove', (event) => {
                const e = event || window.event
                const x = e.clientX
                const y = e.clientY
                movex = (x / 200 - document.body.offsetWidth / 400) * 1.1
                movey = (y / 120 - document.body.offsetHeight / 240) * 1.1
            })

            // 开始！
            run()
        }
    }
}
</script>
<style lang="less" scoped>
  .canvas_on{
    position: absolute;
    margin: auto;
    bottom: 10px;
    left: 0;
    right: 0;
  }
</style>
