import { Component } from 'react';
import ItemTable from './itemTable';

class Items extends Component {

    constructor(props) {
        super();

        // bindaus funktioon, joka on määritetty render-funktiossa html-elementille
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.resetData = this.resetData.bind(this);

        // Komponentin oletustila voidaan määrittää näin:
        this.state = {
            data: null,
            nimi: "",
            hylly: "",
        }
    }

    resetData(){
        this.setState({data: null});
    }

    handleChange(event) {
        if (event.target.name == "nimi") {
            this.setState({nimi: event.target.value});  
        } else {
            this.setState({hylly: event.target.value});  
        }    
    }

    handleSubmit(event) {
        event.preventDefault();
        this.resetData();
        this.fetchData();
    }

    // Tämä on ns. reactin lifecycle metodi, joka aktivoituu sen jälkeen, kun
    // html-puu on luotu. Käytännössä vastaa jQueryn document.ready(function(){//koodi })
    // määrittelyä, mutta tämä on komponenttikohtainen
    componentDidMount() {
        this.fetchData();
    }

    // asynkroniset eli säikeistetyt funktiot määritetään näin:
    async fetchData() {
        // await odottaa vastauksen fetch:ltä, ennen kuin data käsitellään, jos sitä ei olisi, niin
        // kääntäjä jatkaisi ja pyyntö jäisi roikkumaan ilmaan
        let response = await fetch("http://localhost:4000/tavarat?nimi_like=" + this.state.nimi + "&hylly_like=" + this.state.hylly);
        let data = await response.json();
        //console.log("data: " + data);
        //console.log("data: " + JSON.stringify(data));
        //console.log(data);
        // Tällä voidaan muuttaa komponentin tilaa. Tässä objektin sisällä objektin ominaisuus on
        // määritelty constructorilla ja dataa vastaava data on se, joka tulee yllä json-serveriltä
        this.setState({data: data});
    }

    render() {
        let searchForm = (
            <form onSubmit={this.handleSubmit}>        
                <label>
                    Nimi:
                    <input type="text" value={this.state.nimi} name = "nimi" onChange={this.handleChange} />
                </label>
                <br/>
                <label>
                    Hylly:
                    <input type="text" value={this.state.hylly} name = "hylly" onChange={this.handleChange} />
                </label>
                <br/>
                <input type="submit" value="Hae" />
            </form>
        )
        if (this.state.data == null) {
        // Tämä koodi palautuu komponenttia luodessa, koska alustettiin data konstruktorissa
            return (
                <div>
                    <p>Loading ...</p>
                </div>
            )
        } else if (this.state.data.length > 0) {
          // Vasta kun data on haettu json-serveriltä, niin voidaan käsitellä data ja lisätä html-komponentit
            return (
                <div>
                    {searchForm}
                    <ItemTable data = {this.state.data} fetchData = {this.fetchData} resetData = {this.resetData} />
                </div>
            )
        } else {
            return (
                <div>
                    {searchForm}
                    <p>Annetuilla hakuehdoilla ei löytynyt dataa</p>
                </div>
            )
        }
    }
}

export default Items