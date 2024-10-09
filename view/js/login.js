const login = async(e)=>{
    try {
        e.preventDefault();
        const form = e.target;
        const data = {
        email: form.elements[0].value.trim(),
        password: form.elements[1].value.trim(),
        }
    
        const res = await axios.post('/api/login', data);

        localStorage.setItem("auth", res.data.token)
        // await new Swal({
        //     icon: 'success',
        //     title: res.data.message,
        // })
        window.location = '/app/dashboard.html'
    } 
    catch (err) {
        await new Swal({
            icon: 'error',
            title: err.response.data.message,
            
        })
    }

}