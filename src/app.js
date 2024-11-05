document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        items: [
            { id: 1, name: 'Founder\'s', img: '1.jpg', price: 20000},
            { id: 2, name: 'Hundred Mile', img: '2.jpg', price: 25000},
            { id: 3, name: 'Holler Mtn.', img: '3.jpg', price: 30000},
            { id: 4, name: 'Hair Bender', img: '4.jpg', price: 35000},
            { id: 5, name: 'Los Picos', img: '5.jpg', price: 40000},
        ],
    }));

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,
        add(newItem) {
            // cek adakah barang yang sama di cart
            const cartItem = this.items.find((item) => item.id === newItem.id);

            // jika belum ada/masih kosong
            if (!cartItem) {
                this.items.push({ ...newItem, quantity: 1, total: newItem.price});
                this.quantity++;
                this.total += newItem.price;
            } else {
                // jika barang sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
                this.items = this.items.map((item) => {
                    // jika barang berbeda
                    if (item.id !== newItem.id) {
                        return item;
                    } else {
                        //jika barang sudah ada, tambah qty dan totalnya
                        item.quantity++;
                        item.total = item.price * item.quantity;
                        this.quantity++;
                        this.total += item.price;
                        return item;
                    }
                });
            }
        },
        remove(id) {
            //ambil item yang mau di-remove berdasarkan id
            const cartItem = this.items.find((item) => item.id === id);

            //jika item lebih dari 1
            if(cartItem.quantity > 1) {
                //telusuri 1 1
                this.items = this.items.map((item) => {
                    // jika bukan barang yang di-klik
                    if(item.id !== id) {
                        return item;
                    } else {
                        item.quantity--;
                        item.total = item.price * item.quantity;
                        this.quantity--;
                        this.total -= item.price;
                        return item;
                    }
                });
            } else if (cartItem.quantity === 1) {
                // jika barang sisa 1
                this.items = this.items.filter((item) => item.id !== id);
                this.quantity--;
                this.total -= cartItem.price;
            }
        }
    }); 
});

// form validation
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function () {
    for(let i = 0; i < form.elements.length; i++) {
        if(form.elements[i].value.length !== 0) {
            checkoutButton.classList.remove('disabled');
            checkoutButton.classList.add('disabled');
        } else {
            return false;
        }
    }
    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');
});

// kirim data ketika tombol di-klik
checkoutButton.addEventListener('click', function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    console.log(objData); 
});

// konversi ke Rupiah
const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
}
