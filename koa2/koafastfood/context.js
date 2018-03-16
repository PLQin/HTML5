const Koa = require('koa')
const app = new Koa()

async function receiver(ctx) {
    ctx.reject();
}

app.use(receiver)

app.on('error', (error, ctx) => {

    console.log(error, ctx)
})

const port = 30103
app.listen(port, () => {
    console.log(`127.0.0.1:${port} is listening`)
})