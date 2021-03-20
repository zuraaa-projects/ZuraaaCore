import axios from 'axios'
import { URLSearchParams } from 'url'
import { captcha } from '../../config.json'

export async function validateReCaptcha (response: string): Promise<boolean> {
  if (!captcha.enabled) {
    return true
  }

  const body = new URLSearchParams({
    secret: captcha.secret,
    response
  })

  try {
    const { data: { success } } = await axios.post('', body.toString())
    return success
  } catch (error) {
    return false
  }
}
