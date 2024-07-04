import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export const loaderProgress = (state, className) => {
  if (state === true) {
    NProgress.start()
    document.body.classList.add('cursor-progress')
    if (className) {
      const element = document.getElementById('root')
      element.classList.add('cursor-progress')

      const elementClass = document.getElementsByClassName(className)
      for (var i = 0; i < elementClass.length; i++) {
        elementClass[i].classList.add('cursor-progress')
      }
    }
  } else {
    NProgress.done()
    document.body.classList.remove('cursor-progress')
    if (className) {
      const element = document.getElementById('root')
      element.classList.remove('cursor-progress')

      const elementClass = document.getElementsByClassName(className)
      for (var i = 0; i < elementClass.length; i++) {
        elementClass[i].classList.remove('cursor-progress')
      }
    }
  }
}

export const showProgress = () => {
  loaderProgress(true)
}
export const hideProgress = () => {
  loaderProgress(false)
}
export const progressInCard = (state) => {
  loaderProgress(state, 'card-body')
}

export const showProgressBtn = () => {
  loaderProgress(true, 'btn')
}

export const hideProgressBtn = () => {
  loaderProgress(false, 'btn')
}
