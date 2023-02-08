import './App.css';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, Line,
} from 'recharts';
import axios from 'axios';
import React, {useEffect, useState} from 'react';

const serverURL = 'http://localhost:8000/'

function App() {
    const [values, setValues] = useState();
    const [formValues, setFormValues] = useState();

    const onFormSubmit = (fields) => {
        setFormValues(fields);
    }

    useEffect(() => {
        if (!formValues) return;

        (async () => {
            let params = new URLSearchParams();
            params.append('cols', formValues.xField);
            params.append('cols', formValues.yField);
            params.append('filters', formValues.filters)
            params.append('limit', '1000');

            let res = await axios.get(serverURL, {params});
            let data = res.data;
            setValues(data);
        })();
    }, [formValues]);

    return (<div className="App">
        {formValues && values ? <Chart data={values} fields={formValues}/> : null}
        <FieldsForm onSubmit={onFormSubmit}/>
    </div>)
}

const Chart = ({data, fields}) => {
    const slope = -0.13817023240885543;
    const intercept = 21.881943337595885
    // const testPoints = [{[fields.xField]: 65, y: slope * 65 + intercept}, {
    //     [fields.xField]: 80, y: slope * 65 + intercept
    // }]

    const testPoints = [{[fields.xField]: 65, [fields.yField]: 40}, {
        [fields.xField]: 80, [fields.yField]: 50
    }]

    console.log(testPoints)
    console.log(data)

    return (<div>
        <ScatterChart width={1000} height={500}>
            <CartesianGrid/>
            <XAxis dataKey={fields.xField}/>
            <YAxis dataKey={fields.yField}/>
            <Line
                type="linear"
                data={testPoints}
                dataKey={fields.yField}
                dot={false}
                strokeWidth={4}
            />
            <Tooltip/>
            <Scatter data={data} fill="#8884d8"/>
        </ScatterChart>
    </div>);
}

const FieldsForm = (onFormSubmit) => {
    const [fields, setFields] = useState({
        xField: '', yField: '', filters: ''
    });

    const handleXField = (event) => {
        setFields({...fields, xField: event.target.value})
    }

    const handleYField = (event) => {
        setFields({...fields, yField: event.target.value})
    }

    const handleFilter = (event) => {
        setFields({...fields, filters: event.target.value})
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        onFormSubmit.onSubmit(fields);
    }

    return (<form onSubmit={handleSubmit}>
        <input
            value={fields.xField}
            placeholder="X Variable"
            onChange={handleXField}
        />
        <input
            value={fields.yField}
            placeholder="Y Variable"
            onChange={handleYField}
        />
        <textarea
            rows="1"
            cols="30"
            value={fields.filter}
            placeholder="Filters"
            onChange={handleFilter}
        />
        <input type="submit" value="Update Graph"/>
    </form>)
}

export default App;
