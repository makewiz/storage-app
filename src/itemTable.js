import React, { useState, useEffect } from 'react';

function ItemTable(props) {

    const [editId, setEditId] = useState(0);
    const [name, setName] = useState("");
    const [shelf, setShelf] = useState(0);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [depth, setDepth] = useState(0);
    const [weight, setWeight] = useState(0);
    const [count, setCount] = useState(0);
    const [shelfData, setShelfData] = useState(null);

    useEffect(() => {
        fetchShelfData();
    });

    async function fetchShelfData() {
        // await odottaa vastauksen fetch:ltä, ennen kuin data käsitellään, jos sitä ei olisi, niin
        // kääntäjä jatkaisi ja pyyntö jäisi roikkumaan ilmaan
        let response = await fetch("http://localhost:4000/hyllyt");
        let data = await response.json();
        //console.log("data: " + data);
        //console.log("data: " + JSON.stringify(data));
        //console.log(data);
        // Tällä voidaan muuttaa komponentin tilaa. Tässä objektin sisällä objektin ominaisuus on
        // määritelty constructorilla ja dataa vastaava data on se, joka tulee yllä json-serveriltä
        setShelfData(data);
    }

    async function saveChanges() {
        props.resetData();
        await fetch("http://localhost:4000/tavarat/" + editId,
            {
                method: 'PUT', // Tässä voidaan määrittää metodi
                headers: { // jos http-kutsu tehdään näin, niin pitää määrittää myös headerit
                    'Content-Type': 'application/json',
                },
                // body-lohkossa pitää välittää data palvelimelle post ja put-metodeilla. Deletellä tämä ei ole pakollista
                body: JSON.stringify({ nimi: name, hylly: shelf, korkeus: height, leveys: width, syvyys: depth, paino: weight, määrä: count }),
            }).then((response) => {
                setEditId(0);
                setName("");
                setShelf(1);
                setHeight(0);
                setWidth(0);
                setDepth(0);
                setWeight(0);
                setCount(0);
                console.log(response);
                props.fetchData();
            })
    }
    function cancelEdit() {
        setEditId(0);
        setName("");
        setShelf(1);
        setHeight(0);
        setWidth(0);
        setDepth(0);
        setWeight(0);
        setCount(0);
    }
    function editItem(index) {
        setEditId(props.data[index].id);
        setName(props.data[index].nimi);
        setShelf(props.data[index].hylly);
        setHeight(props.data[index].korkeus);
        setWidth(props.data[index].leveys);
        setDepth(props.data[index].syvyys);
        setWeight(props.data[index].paino);
        setCount(props.data[index].määrä);
    }
    async function deleteItem(event) {
        props.resetData();
        console.log(event.target.id);
        // Kutsutaan fetchiä delete-metodilla
        await fetch("http://localhost:4000/tavarat/" + event.target.id,
            {
                method: 'DELETE', // Tässä voidaan määrittää metodi
                headers: { // jos http-kutsu tehdään näin, niin pitää määrittää myös headerit
                    'Content-Type': 'application/json',
                }
            }).then((response) => {
                console.log(response);
                props.fetchData();
            })
    }

    async function addItem() {
        props.resetData();
        // näin voidaan määrittää asynkroninen haku ilman, että se erikseen otetaan muuttujaan
        await fetch("http://localhost:4000/tavarat",
            {
                method: 'POST', // Tässä voidaan määrittää metodi
                headers: { // jos http-kutsu tehdään näin, niin pitää määrittää myös headerit
                    'Content-Type': 'application/json',
                },
                // body-lohkossa pitää välittää data palvelimelle post ja put-metodeilla. Deletellä tämä ei ole pakollista
                body: JSON.stringify({ nimi: name, hylly: shelf, korkeus: height, leveys: width, syvyys: depth, paino: weight, määrä: count }),
            }).then((response) => {
                setEditId(0);
                setName("");
                setShelf(1);
                setHeight(0);
                setWidth(0);
                setDepth(0);
                setWeight(0);
                setCount(0);
                console.log(response);
                props.fetchData();
            })
    }

    function getShelfOptions() {
        if (shelfData != null) {
            let shelfOptions = shelfData.map(hylly =>
                <option key={hylly.id} value={hylly.id}>{hylly.id}</option>
            );
            return shelfOptions;
        } else {
            return null;
        }
    }

    function renderNewItemRow() {
        if (editId == 0) {
            return (
                <tr>
                    <td>+</td>
                    <td><input type="text" value={name} name="nimi" onChange={(event) => setName(event.target.value)} style={{ width: "100%" }} /></td>
                    <td><select value={shelf} name="hylly" onChange={(event) => setShelf(event.target.value)} style={{ width: "100%" }}>{getShelfOptions()}</select></td>
                    <td><input type="number" value={height} name="korkeus" onChange={(event) => setHeight(event.target.value)} min="0" style={{ width: "100%" }} /></td>
                    <td><input type="number" value={width} name="leveys" onChange={(event) => setWidth(event.target.value)} min="0" style={{ width: "100%" }} /></td>
                    <td><input type="number" value={depth} name="syvyys" onChange={(event) => setDepth(event.target.value)} min="0" style={{ width: "100%" }} /></td>
                    <td><input type="number" value={weight} name="paino" onChange={(event) => setWeight(event.target.value)} min="0" style={{ width: "100%" }} /></td>
                    <td><input type="number" value={count} name="määrä" onChange={(event) => setCount(event.target.value)} min="0" style={{ width: "100%" }} /></td>
                    <td><button onClick={addItem}>Lisää</button></td>
                </tr>
            );
        } else {
            return null;
        }
    }

    let dataObjektit = props.data.map((tavara, index) => {
        if (editId == tavara.id) {
            return (
                <tr key={tavara.id}>
                    <td>{tavara.id}</td>
                    <td><input type="text" value={name} name="nimi" index={index} onChange={(event) => setName(event.target.value)} style={{ width: "100%" }} /></td>
                    <td><select value={shelf} name="hylly" onChange={(event) => setShelf(event.target.value)} style={{ width: "100%" }}>{getShelfOptions()}</select></td>
                    <td><input type="number" value={height} name="korkeus" index={index} onChange={(event) => setHeight(event.target.value)} min="0" style={{ width: "100%" }} /></td>
                    <td><input type="number" value={width} name="leveys" index={index} onChange={(event) => setWidth(event.target.value)} min="0" style={{ width: "100%" }} /></td>
                    <td><input type="number" value={depth} name="syvyys" index={index} onChange={(event) => setDepth(event.target.value)} min="0" style={{ width: "100%" }} /></td>
                    <td><input type="number" value={weight} name="paino" index={index} onChange={(event) => setWeight(event.target.value)} min="0" style={{ width: "100%" }} /></td>
                    <td><input type="number" value={count} name="määrä" index={index} onChange={(event) => setCount(event.target.value)} min="0" style={{ width: "100%" }} /></td>
                    <td><button onClick={saveChanges} id={tavara.id}>Tallenna</button></td>
                    <td><button onClick={cancelEdit} id={tavara.id}>Peruuta</button></td>
                </tr>
            )
        } else {
            return (
                <tr key={tavara.id}>
                    <td>{tavara.id}</td>
                    <td>{tavara.nimi}</td>
                    <td>{tavara.hylly}</td>
                    <td>{tavara.korkeus}</td>
                    <td>{tavara.leveys}</td>
                    <td>{tavara.syvyys}</td>
                    <td>{tavara.paino}</td>
                    <td>{tavara.määrä}</td>
                    {
                        editId == 0 ? <td><button onClick={() => editItem(index)} id={tavara.id}>Muokkaa</button></td> : null
                    }
                    {
                        editId == 0 ? <td><button onClick={deleteItem} id={tavara.id}>Poista</button></td> : null
                    }

                </tr>
            )
        }
    });
    return (
        <table>
            <thead>
                <tr>
                    <th style={{ width: "20px" }}>Id</th>
                    <th style={{ width: "200px" }}>Nimi</th>
                    <th style={{ width: "20px" }}>Hylly</th>
                    <th style={{ width: "20px" }}>Korkeus</th>
                    <th style={{ width: "20px" }}>Leveys</th>
                    <th style={{ width: "20px" }}>Syvyys</th>
                    <th style={{ width: "20px" }}>Paino</th>
                    <th style={{ width: "20px" }}>Määrä</th>
                </tr>
            </thead>
            <tbody>
                {dataObjektit}
                {renderNewItemRow()}
            </tbody>
        </table>
    )
}
export default ItemTable