export function logout(navigate) {
    localStorage.removeItem("jwt")
    navigate('/register')
}