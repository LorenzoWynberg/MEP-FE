import axios from 'axios'
import { envVariables } from 'Constants/enviroment'

const useFaceRecognition = () => {
  const thereIsFace = async (imageBase64) => {
    try {
      const response = await axios.post<any>(`${envVariables.BACKEND_URL}/api/Identidad/Persona/PictureHasFace`,
        { imageBase64 }
      )

      const { faceDetails } = response.data
      console.log(response.data)
      if (faceDetails.lenght == 0) return false

      return faceDetails[0].confidence > 90
    } catch (e) {
      console.log(e.message)
    }
  }

  return {
    thereIsFace
  }
}

export default useFaceRecognition
