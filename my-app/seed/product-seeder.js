var Product = require('../models/product')

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true })

var products = [
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Gothic',
        price: 10,
        quantity: 5
    }),
    new Product({
        imagePath: 'https://www.minecraft.net/content/dam/games/minecraft/key-art/Minecraft-Java_Keyart_255x383.jpg',
        title: 'Minecraft',
        price: 25,
        quantity: 4
    }),
    new Product({
        imagePath: 'https://a.allegroimg.com/s512/11239d/5edbb25d4e8399cc76851efc0a56/GTA-5-V-PREMIUM-EDITION-ONLINE-PELNA-WERSJA-PC-PL',
        title: 'GTA V',
        price: 12,
        quantity: 3
    }),
    new Product({
        imagePath: 'https://image.ceneostatic.pl/data/products/14749639/i-portal-2-digital.jpg',
        title: 'Portal 2',
        price: 11,
        quantity: 2
    }),
    new Product({
        imagePath: 'https://prod-api.mediaexpert.pl/api/images/gallery_500_500/thumbnails/images/36/3602629/elden_ring.jpg',
        title: 'Elden Ring',
        price: 51,
        quantity: 1
    }),
]

var done = 0

for (var i = 0; i<products.length; i++) {
    products[i].save(function(error, result) {
        done++
        if (done === products.length) {
            exit()
        }
    })
}

function exit() {
    mongoose.disconnect()
}