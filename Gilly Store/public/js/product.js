$(document).ready(() => {
    $('#btnAdd').click((e) => {
        e.preventDefault()

        let Name = $('#txtName').val()
        let Price = $('#txtPrice').val()
        let Discount = $('#txtDiscount').val()
        let Size = $('#txtSize').val()
        let Slug = $('#txtSlug').val()
        let Parent = $('#txtParent').val()
        let Status = $('#txtStatus').val()
        let Image = $('#txtImage').val()

        if (Name.length < 5 || Price.length < 5 || Size.length < 2 || Slug.length < 10 || Image.length == 0) {

            alert('Vui lòng kiểm tra lại thông tin !')
        } else {
            axios.post('/admin/themsanpham', {
                Name: Name,
                Price: Price,
                Discount: Discount,
                Size: Size,
                Slug: Slug,
                Parent: Parent,
                Image: Image,
                Status: Status
            })
                .then((response) => {
                    if (response.data.result === 0) {
                        alert('Đã có lỗi xảy ra vui lòng thử lại sau !')
                    } else {
                        alert('Thành công !')
                        location.reload()
                    }
                })
        }
    })

    $('.btn-edit').click((e) => {
        let id = e.target.id
        for (let p of product) {
            if (p._id == id) {
                $('#txtName').val(p.Name)
                $('#txtPrice').val(p.Price)
                $('#txtDiscount').val(p.Discount)
                $('#txtSize').val(p.Size)
                $('#txtSlug').val(p.Slug)
                $('#txtParent').val(p.Parent)
                $('#txtStatus').val(p.Status)
                $('#txtImage').val(p.Image)
                $('#txtId').val(p._id)
            }
        }
    })

    $('#btnEdit').click((e) => {
        e.preventDefault()

        let Name = $('#txtName').val()
        let Price = $('#txtPrice').val()
        let Discount = $('#txtDiscount').val()
        let Size = $('#txtSize').val()
        let Slug = $('#txtSlug').val()
        let Parent = $('#txtParent').val()
        let Status = $('#txtStatus').val()
        let Image = $('#txtImage').val()
        let Id = $('#txtId').val()

        if (Name.length < 5 || Price.length < 5 || Size.length < 2 || Slug.length < 10 || Image.length == 0) {

            alert('Vui lòng kiểm tra lại thông tin !')
        } else {
            axios.post('/admin/suasanpham', {
                id: Id,
                Name: Name,
                Price: Price,
                Discount: Discount,
                Size: Size,
                Slug: Slug,
                Parent: Parent,
                Image: Image,
                Status: Status
            })
                .then((response) => {
                    if (response.data.result === 0) {
                        alert('Đã có lỗi xảy ra vui lòng thử lại sau !')
                    } else {
                        alert('Thành công !')
                        location.reload()
                    }
                })
        }
    })

    $('#btnDel').click((e) => {
        e.preventDefault()

        let Id = $('#txtId').val()

        axios.post('/admin/xoasanpham', {
            id: Id,
        })
            .then((response) => {
                if (response.data.result === 0) {
                    alert('Đã có lỗi xảy ra vui lòng thử lại sau !')
                } else {
                    alert('Thành công !')
                    location.reload()
                }
            })
    })

})