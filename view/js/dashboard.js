window.onload = async()=>{
    const session = await getSession();

    if (!session)
        return window.location = '/login.html'

    profileInfo(session.user)
}


