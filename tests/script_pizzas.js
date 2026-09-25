import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { check } from 'k6';
import http from 'k6/http';

const baseUrl = 'http://localhost:3000/api/v1/pizzas';

export default function () {
    const respuestaGet = http.get(baseUrl);
    check(respuestaGet, {
        'GET /pizzas status 200': (r) => r.status === 200
    });

    const cargaPost = JSON.stringify({
        nombre: 'Pepperoni K6',
        descripcion: 'Pizza de prueba de carga',
        precio: 150
    });

    const parametros = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const respuestaPost = http.post(baseUrl, cargaPost, parametros);
    check(respuestaPost, {
        'POST /pizzas status 201': (r) => r.status === 201
    });

    let idCreado = null;
    if (respuestaPost.status === 201) {
        const cuerpo = JSON.parse(respuestaPost.body);
        idCreado = cuerpo.id;
    }

    if (idCreado) {
        const respuestaGetPorId = http.get(`${baseUrl}/${idCreado}`);
        check(respuestaGetPorId, {
            'GET /pizzas/:id status 200': (r) => r.status === 200
        });

        const cargaPut = JSON.stringify({
            nombre: 'Pepperoni K6 Actualizada',
            precio: 180
        });

        const respuestaPut = http.put(`${baseUrl}/${idCreado}`, cargaPut, parametros);
        check(respuestaPut, {
            'PUT /pizzas/:id status 200': (r) => r.status === 200
        });

        const respuestaDelete = http.del(`${baseUrl}/${idCreado}`);
        check(respuestaDelete, {
            'DELETE /pizzas/:id status 200': (r) => r.status === 200
        });
    }
}

export function handleSummary(data) {
    return {
        "reports/index.html": htmlReport(data)
    };
}