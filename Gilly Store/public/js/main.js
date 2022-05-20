let path = window.location.pathname.split('/');
$(document).ready(() => {

    if (path[1] == '' || path[1] == 'danhmuc') {
        loadProduct(product)
    }

    if (path[1] == 'thanhtoan') {
        loadToCheckout()
    }

    loadToCart()

    $('.btn-filter').click((e) => {
        e.preventDefault()
        $('.btn-filter').removeClass('active')
        $('#' + e.target.id).addClass('active')

        //todo: reload the product's list
        let newData
        switch (e.target.id) {
            case 'btnNew':
                newData = sortbyKey(product, '_id', -1);
                loadProduct(newData);
                break;
            case 'btnPop':
                loadProduct(product);
                break;
            case 'btnLow':
                newData = sortbyKey(product, 'Price', 1);
                loadProduct(newData);
                break;
            case 'btnHigh':
                newData = sortbyKey(product, 'Price', -1);
                loadProduct(newData);
                break;
            case 'btnBest':
                newData = sortbyKey(product, 'Sales', -1);
                loadProduct(newData);
                break;
        }

    })

    $('.item-like').click((e) => {
        e.preventDefault()
        let raw_id = (e.target.id).split('_')
        if (e.target.classList.contains('click')) {
            $('#liketag_' + raw_id[1]).addClass('hidden')
            $('#' + e.target.id).removeClass('click')
        } else {
            $('#liketag_' + raw_id[1]).removeClass('hidden')
            $('#' + e.target.id).addClass('click')
        }
        controlLike(raw_id[1])

    })

    $('.item-size').click((e) => {
        e.preventDefault()
        $('.item-size').removeClass('click')
        $('#size_id_' + e.target.id.split('_')[2]).addClass('click')
    })

    $('#txtSearch').keyup(function (e) {
        let searchStr = $(this).val()
        if (searchStr !== '') {
            let result = allproduct.filter(p => p.Name.toLowerCase().includes(searchStr.toLowerCase()))
            $('.search-result').empty()
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    if (i === 10) {
                        break
                    }
                    $('.search-result').append(`
                        <a target="_self" href="/sanpham/` + result[i].Slug + `"><i class="far fa-search"></i> &nbsp;` + result[i].Name + `</a>
                    `)
                }
            } else {
                $('.search-result').append(`
                        <p style="color: gray; text-align: center">Không tìm thấy !</p>
                    `)
            }

            $('.search-result').css('display', 'block')
        } else {
            $('.search-result').css('display', 'none')
        }
    })

    $('#btnAddtoCart').click((e) => {
        let id = $('#btnAddtoCart').attr('product_id')
        let size = $('.click').text()
        let price = $('.item-price-normal').attr('price')
        let name = $('.col-8 h3').text()

        let cart = []
        let dup = false
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
            for (p of cart) {
                if (p.id === id) {
                    if (p.Size === size) {
                        p.qty = p.qty + 1;
                        dup = true;
                    }
                }
            }
            if (!dup) {
                cart.push({'id': id, 'qty': 1, 'Name': name, 'Price': price, 'Size': size});
            }
            localStorage.setItem('cart', JSON.stringify(cart))
        } else {
            cart.push({'id': id, 'qty': 1, 'Name': name, 'Price': price, 'Size': size})
            localStorage.setItem('cart', JSON.stringify(cart))
        }
        location.reload()
    })

    $('#btnBuyNow').click((e) => {
        e.preventDefault()
        let id = $('#btnBuyNow').attr('product_id')
        let size = $('.click').text()
        let price = $('.item-price-normal').attr('price')
        let name = $('.col-8 h3').text()

        let cart = []
        cart.push({'id': id, 'qty': 1, 'Name': name, 'Price': price, 'Size': size})
        localStorage.setItem('cart', JSON.stringify(cart))

        window.location = '/thanhtoan'
    })

    $('.btnDeleteCartItem').click((e) => {
        e.preventDefault()
        let raw = e.target.id.split('_')
        let id = raw[0]
        let size = raw[1]
        console.log(id, size)
        let cart = JSON.parse(localStorage.getItem('cart'))

        for (i in cart) {
            if (cart[i].id == id && cart[i].Size == size) {
                cart.splice(i, 1)
            }
        }
        localStorage.setItem('cart', JSON.stringify(cart))

        location.reload()
    })

    $('#btnReturn').click((e) => {
        e.preventDefault()
        window.location = '/'
    })

    $('#btnBuy').click((e) => {
        e.preventDefault()

        let Name = $('#txtName').val()
        let Phone = $('#txtPhone').val()
        let Add = $('#txtAdd').val()
        let Note = $('#txtNote').val()

        let cart_raw = JSON.parse(localStorage.getItem('cart'))
        let cart = [];

        for (let i in cart_raw)
            cart.push(cart_raw[i])

        let data = {
            Name: Name,
            Phone: Phone,
            Add: Add,
            Note: Note,
            Cart: JSON.parse(localStorage.getItem('cart'))
        }

        if (Name.length < 10 || Phone.length != 10 || Add.length < 10) {
            alert('Vui lòng nhập thông tin giao hàng hợp lệ !!!')
        } else {
            axios.post('/thanhtoan', {
                Name: Name,
                Phone: Phone,
                Add: Add,
                Note: Note,
                Cart: JSON.parse(localStorage.getItem('cart'))
            })
                .then((response) => {
                    if (response.data.result === 1) {
                        alert('Đặt hàng thành công !')
                    } else {
                        alert('Đã có lỗi khi đặt hàng vui lòng thử lại')
                    }
                    localStorage.removeItem('cart')
                    window.location = '/'
                })
        }

    })

    $('#btnRegister').click((e)=>{
        e.preventDefault()
        let txtName = $('#txtName').val()
        let txtEmail = $('#txtEmail').val()
        let txtPassword = $('#txtPassword').val()
        let txtRePassword = $('#txtRePassword').val()
        let txtPhone = $('#txtPhone').val()
        let txtAddress = $('#txtAdd').val()

        if(txtPassword != txtRePassword){
            alert('Mật khẩu không trùng khớp')
        }else{
            if (txtName.length < 10 || txtPhone.length != 10 || txtAddress.length < 10 ){
                alert('Vui lòng kiểm tra lại thông tin hợp lệ !!!')
            }else{
                axios.post('/dangki', {
                    txtName: txtName,
                    txtEmail: txtEmail,
                    txtAddress: txtAddress,
                    txtPhone: txtPhone,
                    txtPassword:txtPassword
                })
                    .then((response) => {
                        if (response.data.result === 1) {
                            alert('Đăng kí thành công !!!')
                            window.location = '/dangnhap'
                        } else {
                            alert(response.data.errorMsg)
                        }
                    })
            }
        }
    })

})

function checkLike() {
    if (localStorage.getItem('likes')) {
        let list = JSON.parse(localStorage.getItem('likes'))
        for (let i in list) {
            $('#liketag_' + list[i]).removeClass('hidden')
            $('#heart_' + list[i]).addClass('click')
        }
    }
}

function controlLike(id) {
    let list = [];
    if (localStorage.getItem('likes')) {
        list = JSON.parse(localStorage.getItem('likes'))
        if (list.includes(id)) {
            let i = list.indexOf(id);
            if (i > -1) {
                list.splice(i, 1)
            }
        } else {
            list.push(id)
        }
        localStorage.setItem('likes', JSON.stringify(list))
    } else {
        list.push(id);
        localStorage.setItem('likes', JSON.stringify(list))
    }
}

function paginationCategory() {
    let items = $(".items-container .col");
    let numItems = items.length;
    let perPage = 16;
    let prefix = '/#page-'
    if (path[1] == 'danhmuc'){
        prefix = '/danhmuc/' + path[2] + '/#page-'
    }

    items.slice(perPage).hide();

    $('#pagination-container').pagination({
        items: numItems,
        itemsOnPage: perPage,
        prevText: "&laquo;",
        nextText: "&raquo;",
        hrefTextPrefix: prefix,
        onPageClick: function (pageNumber) {
            let showFrom = perPage * (pageNumber - 1);
            let showTo = showFrom + perPage;
            items.hide().slice(showFrom, showTo).show();
        }
    });
}

function loadProduct(product) {
    $('.items-container').empty()
    for (let p in product) {
        let sale = 'hidden'
        let newPrice = product[p].Price - (product[p].Price * product[p].Discount / 100)
        if (product[p].Discount > 0) {
            sale = ''
        }
        $('.items-container').append(`
            <div class="col">
                <div class="item">
                    <a target="_self" href="/sanpham/` + product[p].Slug + `">
                        <img src="` + product[p].Image + `" alt="">
                        <div id="liketag_` + product[p]._id + `" class="item-like-tag hidden">
                            <i class="fas fa-check"></i>
                            <span>Yêu thích</span>
                        </div>
                        <div class="item-sale-tag ` + sale + `">
                            <span class="item-sale">` + product[p].Discount + `%</span>
                            <span class="home-product-item__sale-off-label">GIẢM</span>
                        </div>
                        <span class="item-name">` + product[p].Name + `</span>
                        <div class="item-price">
                            ` + (product[p].Discount > 0 ? `
                            <span class="sale-price-old"><s>` + priceFormat(product[p].Price) + ` đ</s>&nbsp;</span>
                            <span class="normal-price">` + priceFormat(newPrice) + ` đ</span>` : `
                            <span class="normal-price">` + priceFormat(product[p].Price) + ` đ</span>`) + `
                        </div>
                        <span class="item-infor d-flex justify-content-between">
                                <i id="heart_` + product[p]._id + `"class="item-like fas fa-heart"></i>
                                <span>Đã bán ` + product[p].Sales + `</span>
                            </span>
                    </a>
                </div>
            </div>
        `)
    }
    paginationCategory()
    checkLike()
}

function priceFormat(digit) {
    return digit.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
}

function sortbyKey(data, key, order) {
    // 1 : tăng -1 giảm
    if (order === 1) {
        return data.sort(function (a, b) {
            let x = a[key];
            let y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }
    if (order === -1) {
        return data.sort(function (a, b) {
            let x = a[key];
            let y = b[key];
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        });
    }
}

function loadToCart() {
    let sum = 0;
    let tqty = 0;
    if (localStorage.getItem('cart')) {
        let cart = JSON.parse(localStorage.getItem('cart'))

        if (cart.length === 0) {
            $('.cart-number').html(0)
            $('.total-price-cart').html('0 d')
            $('.cart-normal').addClass('hidden')
            $('.cart-empty').removeClass('hidden')
        } else {
            $('.cart-list').empty();

            for (c of cart) {
                sum += parseInt(c.Price) * parseInt(c.qty)
                tqty += parseInt(c.qty)

                $('.cart-list').append(`
                    <div class="cart-item row row-center">
                        <span class="item-name col-6">` + c.Name + ` -size: ` + c.Size + `</span>
                        <span class="item-price col-4">` + priceFormat(parseInt(c.Price)) + ` đ</span>
                        <span class="item-qty col-1">x` + c.qty + `</span>
                        <span id = "` + c.id + `_` + c.Size + `" class="col-12 btnDeleteCartItem">Xoá</span>
                    </div>
                `)
            }
            $('.cart-number').html(tqty)
            $('.total-price-cart').html(priceFormat(sum) + ' đ')
            $('.cart-normal').removeClass('hidden')
            $('.cart-empty').addClass('hidden')
        }

    } else {
        $('.cart-number').html(0)
        $('.total-price-cart').html('0 đ')
        $('.cart-empty').removeClass('hidden')
        $('.cart-normal').addClass('hidden')
    }
}

function loadToCheckout() {
    let sum = 0;
    let tqty = 0;
    if (localStorage.getItem('cart')) {
        let cart = JSON.parse(localStorage.getItem('cart'))

        if (cart.length === 0) {
            window.location = '/'
        } else {
            $('.cart-list-checkout').empty()

            for (let c of cart) {
                sum += parseInt(c.Price) * parseInt(c.qty)
                tqty += parseInt(c.qty)

                $('.cart-list-checkout').append(`
                    <div class="cart-item-checkout row row-center">
                        <span class="item-name col-6">` + c.Name + ` - size: ` + c.Size + `</span>
                        <span class="item-price col-4">` + priceFormat(parseInt(c.Price)) + ` đ</span>
                        <span class="item-qty-checkout col-1">x` + c.qty + `</span>
                    </div>
                `)
            }
            $('.total-price-cart').html(priceFormat(sum) + ' đ')
        }

    } else {
        window.location = '/'
    }
}
