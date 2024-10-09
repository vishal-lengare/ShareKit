
const signup = async (e)=>{
    try {
        e.preventDefault();
        const form = e.target;
        const data = {
        fullname: form.elements[0].value.trim(),
        email: form.elements[1].value.trim(),
        password: form.elements[2].value.trim(),
        }

    const res = await axios.post('/api/signup', data)
    await new Swal({
        icon: 'success',
        title: res.data.message,
        text: 'Click on OK to go login page'
    })
    .then(()=>{
        window.location = "/login.html"
    })

    } 
    catch (err) {
        await new Swal({
            icon: 'error',
            title: err.response.data.message,
            
        })
    }
    
}