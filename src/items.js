import { Component } from 'react';

class Items extends Component {

    constructor(props) {
        super();

        // bindaus funktioon, joka on määritetty render-funktiossa html-elementille
        this.lisaaPoistettava = this.lisaaPoistettava.bind(this);
        this.poista = this.poista.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        // Komponentin oletustila voidaan määrittää näin:
        this.state = {
            data: null,
            nimi: "",
            hylly: "",
            loading: false
        }
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
        this.fetchData();
        this.setState({loading: true});
    }

    // Tämä on ns. reactin lifecycle metodi, joka aktivoituu sen jälkeen, kun
    // html-puu on luotu. Käytännössä vastaa jQueryn document.ready(function(){//koodi })
    // määrittelyä, mutta tämä on komponenttikohtainen
    componentDidMount() {
        //this.fetchData();
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
        this.setState({ data: data, loading: false });
    }

    async lisaaPoistettava() {
        // näin voidaan määrittää asynkroninen haku ilman, että se erikseen otetaan muuttujaan
        await fetch("http://localhost:4000/tavarat",
        {
            method: 'POST', // Tässä voidaan määrittää metodi
            headers: { // jos http-kutsu tehdään näin, niin pitää määrittää myös headerit
              'Content-Type': 'application/json',
            },
            // body-lohkossa pitää välittää data palvelimelle post ja put-metodeilla. Deletellä tämä ei ole pakollista
            body: JSON.stringify({nimi: "tst", hylly: 1}), 
          }).then((response)=>{
              console.log(response);
              this.fetchData();
          })
    }

    async poista(event){
        console.log(event.target.id);
        // Kutsutaan fetchiä delete-metodilla
        await fetch("http://localhost:4000/tavarat/"+ event.target.id,
        {
            method: 'DELETE', // Tässä voidaan määrittää metodi
            headers: { // jos http-kutsu tehdään näin, niin pitää määrittää myös headerit
              'Content-Type': 'application/json',
            }
          }).then((response)=>{
              console.log(response);
              this.fetchData();
          })
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
        if (this.state.loading) {
            return (
                <p>Loading...</p>
            )
        } else if (this.state.data == null) {
        // Tämä koodi palautuu komponenttia luodessa, koska alustettiin data konstruktorissa
            return (
                <div>
                    {searchForm}
                    <p>Hae jotakin</p>
                </div>
            )
        } else if (this.state.data.length > 0) {
          // Vasta kun data on haettu json-serveriltä, niin voidaan käsitellä data ja lisätä html-komponentit
            let dataObjektit = this.state.data.map((tavara) =>
                <tr key = {tavara.id}>
                    <td>{tavara.id}</td>
                    <td>{tavara.nimi}</td>
                    <td>{tavara.hylly}</td>
                    <td>{tavara.korkeus}</td>
                    <td>{tavara.leveys}</td>
                    <td>{tavara.syvyys}</td>
                    <td>{tavara.paino}</td>
                    <td>{tavara.määrä}</td>
                    <td><button onClick={this.poista} id={tavara.id}>Poista</button></td>
                </tr>);
            return (
                <div>
                    {searchForm}
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nimi</th>
                                <th>Hylly</th>
                                <th>Korkeus</th>
                                <th>Leveys</th>
                                <th>Syvyys</th>
                                <th>Paino</th>
                                <th>Määrä</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataObjektit}
                        </tbody>
                    </table>
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