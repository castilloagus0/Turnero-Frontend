export function getUserProfile(): any {
  try{
    const userLog = localStorage.getItem('user')
    return userLog
  }catch(err){
    console.error('Error al consultar al localStorage:', err)

  }
}

export function saveUserProfile(result: any): void {
  localStorage.setItem('token', result.access_token)
  localStorage.setItem('user', JSON.stringify({name: result.user.nombre, rol: result.user.rol}))
  window.dispatchEvent(new Event('storage')) //Esta linea es para que se refresque automaticamente el navbar al haber un nuevo logeo
}

export function clearUserProfile(): void {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.dispatchEvent(new Event('storage'))
}
