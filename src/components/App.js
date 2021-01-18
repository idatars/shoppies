import React, { useState, useEffect } from "react";
import "../App.css";
import {addMovie, removeMovie, member} from '../utilities';
import {Search} from './ui';

const MOVIE_API_URL = "https://www.omdbapi.com/?s=man&apikey=4a3b711b"; // you should replace this with yours

function Movie(props) {
  return (
    <div className="movie">
      <p className="title">{props.movie.Title} ({props.movie.Year})</p>
    </div>
  )
}

function Blurb(props) {
  if (props.value === '') {
    return (
      <p className="desc"><i>To nominate your favourite movies, start by searching for them by title!</i></p>
    )
  } else {
    return (
      <p className="desc">Showing results for '<i>{props.value}'...</i></p>
    )
  }
}

function Submit(props) {
  if (props.success) {
    return <p className="desc" id="thankyou"><i>Thank you for nominating your favourite films!</i></p>
  } else if (props.nominations > 0) return <button onClick={props.onClick} id="submit">Submit Nominations</button>;
  else return <div></div>;
}

class ShortlistButton extends React.Component {
  constructor(props) {
    super(props);
    if (props.nominated) {
      this.state = {
        value: 'Move to Shortlist'
      }
    } else if (props.shortlisted) {
      this.state = {
        value: 'Remove from Shortlist'
      }
    } else {
      this.state = {
        value: 'Add to Shortlist'
      }
    }
    this.clickWrapper = this.clickWrapper.bind(this);
  }

  clickWrapper() {
    if (this.state.value === 'Add to Shortlist' || this.state.value === 'Move to Shortlist') {
      if (this.props.onClick(this.props.movie, 1) === 0) {
        this.setState({value: 'Remove from Shortlist'});
      }
    } else if (this.state.value === 'Remove from Shortlist') {
      if (this.props.onClick(this.props.movie, -1) === 0) {
        this.setState({value: 'Add to Shortlist'});
        this.forceUpdate();
      }
    }
  }

  render() {
    return <button onClick={this.clickWrapper}>{this.state.value}</button>;
  }
}

class NominateButton extends React.Component {
  constructor(props) {
    super(props);
    if (props.nominated) {
      this.state = {
        value: 'Remove from Nominations'
      }
    } else {
      this.state = {
        value: 'Nominate'
      }
    }
    this.clickWrapper = this.clickWrapper.bind(this);
  }

  clickWrapper() {
    if (this.state.value === 'Nominate') {
      if (this.props.onClick(this.props.movie, 1) === 0) this.setState({value: 'Remove from Nominations'});
    } else if (this.state.value === 'Remove from Nominations') {
      if (this.props.onClick(this.props.movie, -1) === 0) this.setState({value: 'Nominate'});
    }
  }

  render() {
    return <button onClick={this.clickWrapper}>{this.state.value}</button>;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      errorMessage: null,
      searchValue: '',
      searchResult: Array(0),
      shortlist: Array(0),
      nominations: Array(0),
      blurb: '',
      submitted: false,
    }
    this.handleSearch = this.handleSearch.bind(this);
    this.shortlist = this.shortlist.bind(this);
    this.nominate = this.nominate.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleSearch(event) {
    event.preventDefault();
    this.setState({loading: true, errorMessage: null});

    if (event.target.value === '') {
      this.setState({loading: false, searchResult: Array(0), blurb: event.target.value, errorMessage: null});
    } else {
      let fixedsearchvalue = event.target.value.replace(' ', '+');
      fetch(`https://www.omdbapi.com/?s=${fixedsearchvalue}&type=movie&apikey=1c15bb9e&page=1`)
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.Response === "True") {
          this.setState({loading: false, searchResult: jsonResponse.Search, blurb: event.target.value});
        } else {
          this.setState({loading: false, errorMessage: jsonResponse.Error, blurb: event.target.value});
        }
      });
    }
    
  }

  submit() {
    this.setState({submitted: true});
  }

  
  shortlist(movie, value) {
    if (value === 1) {
      const shortlist = this.state.shortlist.slice();
      if (addMovie(shortlist, movie) === 0) {
        const nominations = this.state.nominations.slice();
        if (removeMovie(nominations, movie) === 0) this.setState({nominations: nominations});
        this.setState({shortlist: shortlist});
        return 0;
      }
    } else if (value === -1) {
      let temp = this.state.shortlist.slice();
      if (removeMovie(temp, movie) === 0) {
        this.setState({shortlist: temp});
        return 0;
      }
    }
    return 1;
  }

  nominate(movie, value) {
    if (value === 1) {
      const nominations = this.state.nominations.slice();
      if (this.state.nominations.length === 5) {
        alert('You already have the maximum amount of nominations!');
        return 1;
      } else if (this.state.submitted) {
        alert('You have already submitted your nominations!');
        return 1;
      }
      if (addMovie(nominations, movie) === 0) {
        const shortlist = this.state.shortlist.slice();
        if (removeMovie(shortlist, movie) === 0) this.setState({shortlist: shortlist});
        this.setState({nominations: nominations});
        return 0;
      }
    } else if (value === -1) {
      const nominations = this.state.nominations.slice();
      if (removeMovie(nominations, movie) === 0) {
        this.setState({nominations: nominations});
        return 0;
      }
    }
    return 1;
  }

  render () {
    return (
      <div>
        <header>
          <div id="head">
            <h1 className="logo">The Shoppies</h1>
            <Search
              value={this.state.value}
              onChange={(e) => this.handleSearch(e)}
            />
          </div>
        </header>

        <div className="grid">
          <div id="searchresults">
            <Blurb value={this.state.blurb}/>
            
  
              {this.state.loading && !this.state.errorMessage ? (
                <span>loading...</span>
              ) : this.state.errorMessage ? (
                <div className="errorMessage">{this.state.errorMessage}</div>
              ) : this.state.searchResult.length > 0 ? (
                <table>
                  <tr>
                    <th>Year</th>
                    <th>Title</th>
                    <th></th>
                  </tr>

                  {this.state.searchResult.map((movie, index) => (
                    <tr>
                      <td>{movie.Year}</td>
                      <td>{movie.Title}</td>
                      <td className="options">
                        <ShortlistButton movie={movie} onClick={this.shortlist} shortlisted={member(this.state.shortlist, movie)} nominated={member(this.state.nominations, movie)}/>
                        <br></br>
                        <NominateButton movie={movie} onClick={this.nominate} nominated={member(this.state.nominations, movie)}/>
                      </td>
                    </tr>
                  ))}
                </table>
              ) : (
                <div></div>
              )
              }
          </div>

          <div id="shortlist">
            <h2>My Shortlist</h2>
            {this.state.shortlist.length === 0 ? (
              <p>Nothing yet!</p>
            ) : (
              this.state.shortlist.map((movie, index) => (
                <div className="block">
                  <p>{movie.Title} <i>({movie.Year})</i></p>
                  <div className="options">
                    <ShortlistButton movie={movie} onClick={this.shortlist} shortlisted={true} nominated={false}/>
                    <NominateButton movie={movie} onClick={this.nominate} shortlisted={true} nominated={false}/>
                  </div>
                </div>
              ))
            )}
          </div>

          <div id="nominations">
            <h2>My Nominations ({this.state.nominations.length}/5)</h2>
            {this.state.nominations.length === 0 ? (
              <p>Nothing yet!</p>
            ) : (
              this.state.nominations.map((movie, index) => (
                <div className="block">
                  <Movie key={`${index}-${movie.Title}`} movie={movie}/>
                  <div className="options">
                    <ShortlistButton movie={movie} onClick={this.shortlist} shortlisted={false} nominated={true}/>
                    <NominateButton movie={movie} onClick={this.nominate} shortlisted={false} nominated={true}/>
                  </div>
                </div>
              ))
            )}
            <br></br>
            <Submit success={this.state.submitted} nominations={this.state.nominations.length} onClick={this.submit}/>
          </div>
        </div>
      </div>
    )
  }
}



export default App;