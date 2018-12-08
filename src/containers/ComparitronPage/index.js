import React, { Component } from 'react';
import { Navbar } from 'reactstrap';
import ComparitronMovieList from '../../components/CompareMovies/ComparitronMovieList';
import MovieService from '../../services/MovieService';
import logo from '../../components/img/logo.svg';
import ReviewCompareList from '../../components/CompareMovies/ReviewCompareList';
import ComparitronStyles from '../../styles/containers/Comparitron/Comparitron'
import LogoStyle from '../../styles/containers/Comparitron/LogoStyle'
import Container from '../../styles/containers/Comparitron/Container'
import Sidebars from '../../styles/containers/Comparitron/Sidebars'
import MainContent from '../../styles/containers/Comparitron/MainContent'
import ComparitronMovieHolder from '../../styles/containers/Comparitron/ComparitronMovieHolder'

import '../../styles/components/comparitron.css';

class ComparitronPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movieSelections: [],
      chartSelections: [],
      movies: [],
      movieInput: ''
    }
    this.selectMovie = this.selectMovie.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault();
    var query = this.state.movieInput;
    MovieService.getSearchMovies(query).then((movies) => {
      this.setState({ movies: movies, query: query });
    })
  }

  selectMovie(movie) {
    var movieSelections = this.state.movieSelections;

    var movieExists = movieSelections.findIndex((el, i) => {
      return el.id === movie.id;
    });
    if (movieExists !== -1) {
      movieSelections.splice(movieExists, 1);
    }
    else {
      movieSelections.push(movie);
    }

    this.setState({ movieSelections: movieSelections });
  }

  removeMovie(item) {
    const movieSelections = this.state.movieSelections;

    movieSelections.some((el, i) => {
      if (el.id === item.id) {
        movieSelections.splice(i, 1);
        return true;
      }
    });

    this.setState({
      movieSelections: movieSelections
    });
  }

  handleChartSelection(event) {
    event.preventDefault();

    let chartSelections = this.state.chartSelections;

    var done = chartSelections.some((el, i) => {
      if (el === event.target.id) {
        chartSelections.splice(i, 1);
        document.getElementById(event.target.id).style.borderColor = "transparent";
        return true;
      }
    });

    if (!done) {
      chartSelections.push(event.target.id);
      document.getElementById(event.target.id).style.borderColor = "gray";
    }

    this.setState({
      chartSelections: chartSelections
    });
  }

  render() {
    return (
      <div>
        <Navbar className="navbar-style" light expand="md">
          <LogoStyle>
            <a href="/"><img src={logo} alt='CineScope'/></a>
          </LogoStyle>
          <h1 className="comparitron-logo">Comparitron</h1>
        </Navbar>
        <Container>
          <Sidebars>
            <form id="addItemForm" onSubmit={this.handleSubmit.bind(this)}>
              <p className="select-text">SELECT MOVIES</p>
              <input
                style={ComparitronStyles.input}
                type="search"
                placeholder="Enter a movie"
                value={this.state.movieInput}
                onChange={event => this.setState({ movieInput: event.target.value })} />
                {/* Kept in for padding */}
              <ul style={ComparitronStyles.list}>
              </ul>
            </form>
            <ComparitronMovieHolder className="movie-holder">
              <ComparitronMovieList movies={this.state.movies} selectMovie={this.selectMovie} />
            </ComparitronMovieHolder>
          </Sidebars>
          <MainContent className="scroll">
		  	<ReviewCompareList
				movies={this.state.movieSelections}
				chartSelections={this.state.chartSelections}
			/>
		  </MainContent>
          <Sidebars>
            <p className="select-text">SELECT CHARTS</p>
            <button className="review-selection" id="Rotten Tomatoes" onClick={this.handleChartSelection.bind(this)}>Rotten Tomatoes</button>
            <button className="review-selection" id="IMDb" onClick={this.handleChartSelection.bind(this)}>IMDb</button>
            <button className="review-selection" id="Metacritic" onClick={this.handleChartSelection.bind(this)}>Metacritic</button>
            {/*<button className="review-selection" id="Box Office" onClick={this.handleChartSelection.bind(this)}>Box Office</button>
            <button className="review-selection" id="Overview" onClick={this.handleChartSelection.bind(this)}>Overview</button>*/}
            <hr></hr>
            <p className="select-text">SELECTED MOVIES</p>
            <ul style={ComparitronStyles.listPadding}>
              {this.state.movieSelections.map(item => (
                <div className="movie-selection" key={item.title}>
                  <span style={ComparitronStyles.movieSelection} onClick={() => this.removeMovie(item)}>X</span>
                  &nbsp; &nbsp; {item.title}
                </div>
              ))}
            </ul>
          </Sidebars>
        </Container>
      </div>
    );
  }
}

export default ComparitronPage;
