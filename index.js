const { response } = require('express')
const express = require('express')
const uuid = require('uuid')
const port = 3000
const app = express()
app.use(express.json())

const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex(order => order.id === id)
    if (index < 0) {
        return response.status(404).json({ error: "order not found" })
    }

    request.orderId = id
    request.orderIndex = index

    next()

}

const checkMethod = (request, response, next) => {
    const methodRequest = request.method
    const url = request.url

    console.log(`[${methodRequest}] ${url}`)
    next()
}

app.get('/order', checkMethod, (request, response) => {
    return response.json(orders)
})


app.post('/order', checkMethod, (request, response) => {
    const { order, clientName, price } = request.body
    const newOrder = { id: uuid.v4(), order, clientName, price, status: "Em andamento" }

    orders.push(newOrder)

    return response.status(201).json(newOrder)
})



app.put('/order/:id', checkOrderId, checkMethod, (request, response) => {

    const { order, clientName, price, } = request.body
    const id = request.orderId
    const index = request.orderIndex
    
    const updatedOrder = { id, order, clientName, price, status: "Em andamento" }

    orders[index] = updatedOrder

    return response.json(updatedOrder)
})

app.delete('/order/:id', checkOrderId, checkMethod, (request, response) => {
    const index = request.orderIndex

    orders.splice(index,1)


    return response.status(204).json()
})

app.get('/order/:id', checkOrderId, checkMethod, (request, response) => {
    const index = request.orderIndex
    return response.json(orders[index])
})

app.patch('/order/:id', checkOrderId, checkMethod, (request, response) => {
    const index = request.orderIndex
    const id = request.orderId
    const {order, clientName, price} = orders[index]
    const finisheOrder = { id, order, clientName, price, status: "Pronto" }
    orders[index] = finisheOrder

    return response.status(204).json(finisheOrder)
})



app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
})