import React, { Component } from 'react'
import {
  GoogleMap,
  LoadScript,
  Marker,
  Data,
} from '@react-google-maps/api'
import Pagination from 'react-js-pagination'
import './App.css'

class App extends Component {
  state = {
    photos: [],
    activePage: 0,
    perPage: 0,
    totalItemsCount: 0,
    totalpages: 0,
    lat: '',
    lon: '',
    error: ''
  }

  handlePageChange (pageNumber) {
    fetch(
      `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${process.env.FLICKR_API_KEY}&lat=${this.state.lat}&lon=${this.state.lon}&format=json&nojsoncallback=1&page=${pageNumber}`
    )
      .then(response => {
        return response.json()
      })
      .then(data => {
        let photosarr = data.photos.photo.map(pic => {
          return (
            <a
              key={pic.id}
              href={`https://farm${pic.farm}.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}.jpg`.replace(
                '"',
                ''
              )}
              target='blank'
            >
              <img
                key={pic.id}
                src={`https://farm${pic.farm}.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}.jpg`.replace(
                  '"',
                  ''
                )}
                alt='not available'
              />
            </a>
          )
        })
        this.setState({
          photos: photosarr,
          activePage: data.photos.page,
          error: photosarr.length > 0 ? '' : 'No photos here'
        })
      })
      .catch(error => {
        this.setState({
          error: error.message
        })
      })
  }

  onClick = (lat, lon) => {
    this.setState({
      lat,
      lon
    })

    fetch(
      `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${process.env.FLICKR_API_KEY}&lat=${lat}&lon=${lon}&format=json&nojsoncallback=1`
    )
      .then(response => {
        return response.json()
      })
      .then(data => {
        let photosarr = data.photos.photo.map(pic => {
          return (
            <a
              key={pic.id}
              href={`https://farm${pic.farm}.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}.jpg`.replace(
                '"',
                ''
              )}
              target='blank'
            >
              <img
                key={pic.id}
                src={`https://farm${pic.farm}.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}.jpg`.replace(
                  '"',
                  ''
                )}
                alt='not available'
              />
            </a>
          )
        })
        this.setState({
          photos: photosarr,
          activePage: data.photos.page,
          perPage: data.photos.perpage,
          totalItemsCount: parseInt(data.photos.total),
          totalpages: data.photos.pages,
          error: photosarr.length > 0 ? '' : 'No photos here'
        })

      })
      .catch(error => {
        this.setState({
          error: error.message
        })
      })
  }

  handleChange = e => {
    let target = e.target
    let value = target.value
    let name = target.name

    this.setState({
      [name]: value
    })
  }

  handleSubmit = e => {
    e.preventDefault()

    this.onClick(this.state.lat, this.state.lon)
  }

  componentDidUpdate () {
    window.scrollTo(0, 0)
  }

  render () {
    console.log(this.state.error)
    return (
      <div className='App'>
        <div className='Navbar'>
          Search photos by location
          <form className='location' onSubmit={this.handleSubmit}>
            <span>
              <input
                id='lat'
                type='text'
                name='lat'
                placeholder='lat'
                value={this.state.lat}
                onChange={this.handleChange}
              />
            </span>
            <span>
              <input
                id='lon'
                type='text'
                name='lon'
                placeholder='lon'
                value={this.state.lon}
                onChange={this.handleChange}
              />
            </span>
            <span>
              <button type='submit'>search</button>
            </span>
          </form>
        </div>
        {this.state.photos.length > 0 ? (
          <div className='imagesBox'>
            <div className='images'>
              {this.state.photos.map(img => {
                return img
              })}
            </div>
            <Pagination
              activePage={this.state.activePage}
              itemsCountPerPage={this.state.perPage}
              totalItemsCount={this.state.totalItemsCount}
              pageRangeDisplayed={5}
              onChange={this.handlePageChange.bind(this)}
              hideDisabled={true}
            />
          </div>
        ) : (
          <div style={{ height: '20px' }}>{this.state.error}</div>
        )}

        <div className='googleMap'>
          <LoadScript googleMapsApiKey={process.env.GOOGLE_API_KEY}>
            <GoogleMap
              mapContainerStyle={{
                width: 'auto',
                height: '500px'
              }}
              center={{
                lat: 12.971599,
                lng: 77.594566
              }}
              zoom={10}
            >
              <Marker
                position={{ lat: this.state.lat, lng: this.state.lon }}
              />
              <Data
                options={{
                  controlPosition: window.google
                    ? window.google.maps.ControlPosition.TOP_LEFT
                    : undefined,
                  drawingMode: 'Point', 
                  featureFactory: geometry => {
                    console.log(
                      'geometry: ',
                      geometry.i.lat(),
                      geometry.i.lng()
                    )
                    this.onClick(geometry.i.lat(), geometry.i.lng())
                  }
                }}
              />
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    )
  }
}

export default App
