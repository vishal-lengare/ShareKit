const profileInfo = (user)=>{
    const fullname = document.getElementById('fullname')
    const email = document.getElementById('email')
    const picture = document.getElementById('picture')
    fullname.innerHTML = user.fullname
    email.innerHTML = user.email
    picture.src = user.picture ? "/"+user.picture : "../images/avt.png"
}
const uploadProfilePic = async (e)=>{
    try {
        const session = await getSession();
        const input = e.target
        const file = input.files[0]
        const fromdata = new FormData()
        fromdata.append('picture',file);

        const options = {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        }
        const res = await axios.post('/api/upload-profile-picture', fromdata, options)
        localStorage.setItem("auth", res.data.token)
        window.location =  location.href
        // console.log(res)
    } 
    catch (err) {
        console.log(err.message)
    }
}