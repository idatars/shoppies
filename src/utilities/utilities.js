export function addMovie(lom, movie) {
    if (movie && movie.imdbID) {
      for (var i = 0; i < lom.length; i++) {
        if (lom[i].imdbID === movie.imdbID) return 1;
      }
      lom.push(movie);
      return 0;
    }
    return 1;
  }
  

export function removeMovie(lom, movie) {
    if (movie && movie.imdbID) {
      for (var i = 0; i < lom.length; i++) {
        if (lom[i].imdbID === movie.imdbID) {
          lom.splice(i, 1);
          return 0;
        }
      }
    }
    return 1;
  }
  
export function member(lom, movie) {
    if (movie && movie.imdbID) {
      for (var i = 0; i < lom.length; i++) {
        if (lom[i].imdbID === movie.imdbID) {
          return true;
        }
      }
    }
    return false;
  }