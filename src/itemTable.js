import React, { useState, useEffect } from 'react';

function ItemTable(props){

    const [editId, setEditId] = useState(0);
    const [name, setName] = useState("");
    const [shelf, setShelf] = useState(0);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [depth, setDepth] = useState(0);
    const [weight, setWeight] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
    });

    function saveChanges() {

    }
    function cancelEdit() {
        setEditId(0);
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

    let dataObjektit = props.data.map((tavara, index) => {
        if (editId == tavara.id) {
            return (
                <tr key = {tavara.id}>
                    <td>{tavara.id}</td>
                    <td><input type="text" value={name} name = "nimi" index = {index} onChange={(event) => setName(event.target.value)} style={{width: "100%"}} /></td>
                    <td><input type="number" value={shelf} name = "hylly" index = {index} onChange={(event) => setShelf(event.target.value)} min = "1"  style={{width: "100%"}}/></td>
                    <td><input type="number" value={height} name = "korkeus" index = {index} onChange={(event) => setHeight(event.target.value)} min = "0"  style={{width: "100%"}}/></td>
                    <td><input type="number" value={width} name = "leveys" index = {index} onChange={(event) => setWidth(event.target.value)} min = "0"  style={{width: "100%"}}/></td>
                    <td><input type="number" value={depth} name = "syvyys" index = {index} onChange={(event) => setDepth(event.target.value)} min = "0"  style={{width: "100%"}}/></td>
                    <td><input type="number" value={weight} name = "paino" index = {index} onChange={(event) => setWeight(event.target.value)} min = "0"  style={{width: "100%"}}/></td>
                    <td><input type="number" value={count} name = "määrä" index = {index} onChange={(event) => setCount(event.target.value)} min = "0"  style={{width: "100%"}}/></td>
                    <td><button onClick={saveChanges} id={tavara.id}>Tallenna</button></td>
                    <td><button onClick={cancelEdit} id={tavara.id}>Peruuta</button></td>
                </tr>
            )
        } else {
            return (
                <tr key = {tavara.id}>
                    <td>{tavara.id}</td>
                    <td>{tavara.nimi}</td>
                    <td>{tavara.hylly}</td>
                    <td>{tavara.korkeus}</td>
                    <td>{tavara.leveys}</td>
                    <td>{tavara.syvyys}</td>
                    <td>{tavara.paino}</td>
                    <td>{tavara.määrä}</td>
                    {
                        editId == 0? <td><button onClick={() => editItem(index)} id={tavara.id}>Muokkaa</button></td>: null
                    }
                    {
                        editId == 0? <td><button onClick={deleteItem} id={tavara.id}>Poista</button></td>: null
                    }
                    
                </tr>
            )
        }
    });
    return (
        <table>
            <thead>
                <tr>
                    <th style={{width: "20px"}}>Id</th>
                    <th style={{width: "200px"}}>Nimi</th>
                    <th style={{width: "20px"}}>Hylly</th>
                    <th style={{width: "20px"}}>Korkeus</th>
                    <th style={{width: "20px"}}>Leveys</th>
                    <th style={{width: "20px"}}>Syvyys</th>
                    <th style={{width: "20px"}}>Paino</th>
                    <th style={{width: "20px"}}>Määrä</th>
                </tr>
            </thead>
            <tbody>
                {dataObjektit}
            </tbody>
        </table>
    )
}
export default ItemTable