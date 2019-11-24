
import React, { Component } from 'react';
import axios from 'axios';
const BASE_URL = 'http://localhost:5000/';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      imageUrls: [],
      imageText: [],
      message: '',
      historyclicked: false,
      historyArray: [],
    }
  }


  getHistory = async (event) => {
    try {
      this.setState({ historyclicked: !this.state.historyclicked })
      let history = await axios.get(`${BASE_URL}all`);
      this.setState({ historyArray: [...history.data] })
      //  let his = history.data.map((element,i) => {
      //  let his = 

      console.log(history, "äll the data");
    } catch (error) {
      console.error(error)
    }
  }

  selectImages = (event) => {
    this.setState({ imageUrls: [], imageText: [], historyclicked: false });
    let images = []
    for (var i = 0; i < event.target.files.length; i++) {
      images[i] = event.target.files.item(i);
    }
    images = images.filter(image => image.name.match(/\.(jpg|jpeg|png|gif)$/))

    let message = `${images.length} valid image(s) selected`
    this.setState({ images, message })
  }

  uploadImages = () => {
    const uploaders = this.state.images.map(image => {
      const data = new FormData();
      data.append("image", image, image.name);

      // Make an AJAX upload request using Axios
      return axios.post(BASE_URL + 'upload', data)
        .then(response => {
          this.setState({
            imageUrls: [response.data.imageUrl],
            imageText: [response.data.text]
          });
        })
    });

    // Once all the files are uploaded 
    axios.all(uploaders).then(() => {
      console.log('done');
    }).catch(err => alert(err.message));
  }

  render() {
    return (
      <div>
        <br />
        <div className="col-sm-12">
          <h3>Upload An Image with Handwritten Text</h3><hr />
          <div className="headerbutton">
            <button className="btn-history" type="button" onClick={this.getHistory} >
              Show History
          </button>
          </div>
          <div className="col-sm-4">
            <input className="form-control " type="file"
              onChange={this.selectImages} multiple />
          </div>
          <p className="text-info">{this.state.message}</p>
          <br /><br /><br />
          <div className="col-sm-4">
            <button className="btn btn-primary" value="Submit"
              onClick={this.uploadImages}>Submit</button>
          </div>
        </div>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><hr /><br />
        <div className="row col-lg-12">
          {
            this.state.imageUrls.map((url, i) => (
              <div className="col-lg-2" key={i}>
                <img src={url} className="img-rounded img-responsive"
                  alt="not available" /><br />
              </div>
            ))
          }
          {
            this.state.imageText.map((url, i) => (
              <div className="col-lg-2" key={i}>
                <p> {url} </p>
              </div>
            ))
          }
        </div>
        <div className="row col-lg-12">
          {
            this.state.historyclicked ?
              this.state.historyArray.map((element, i) => {
                return (

                  <div className="row col-lg-12" key={i}>
                    <div className="col-lg-2" >
                      <img src={element.image} className="img-rounded img-responsive"
                        alt="not available" /><br />
                    </div>
                    <div className="col-lg-2" >
                      <p> {element.result} </p>
                    </div>
                  </div>
                )
              })
              : ''
          }
        </div>
      </div>

    );
  }
}
export default App;

