export const Rand = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}

export const Rand2 = (min, max) => {
  return Math.random() * (max - min) + min
}

export const Lerp = (a,  b , t) => {
  return a + ((b - a) * t)
}