import { 
    Geometry,
    GooglePlaceDetail 
} from "react-native-google-places-autocomplete";

import { 
    ICoordenadas, 
    ICoordenadasDelta 
} from "../interfaces/ICoordenadas";

export function isVoid(valor: string) {
    return (!valor || valor === '');
}

export function primeiraLetraMaiuscula(str: string) {
    const maisculo = str.charAt(0).toUpperCase() + str.slice(1);
    return maisculo;
}

export function formatarEnderecoGoogle(lugar: GooglePlaceDetail ) {

    let endereco = '';
    let cidade = '';
    let estado = '';
    let numero = '';
    let bairro = '';
    let pais = '';
    let cep = ''
    let coordenadas = {} as Geometry['location'];

    // percorre componentes do endereço
    lugar.address_components.forEach(l => {

        const tipo = l.types[0];

        switch(tipo) {            
            case 'street_number':
                numero = l.long_name;
                break;
            case 'route':
                endereco = l.long_name;
                break;
            case 'sublocality':
                break;
            case 'administrative_area_level_2':
                cidade = l.long_name;
                break;    
            case 'administrative_area_level_1':
                estado = l.short_name
                break;
            case 'country':
                pais = l.short_name
                break;
        }

    });

    // resgata coordendas
    coordenadas = { ...lugar.geometry.location };

    // Formata endereço
    const enderecoFinal = `${endereco.length > 0 ? endereco+', ' : ''}${numero.length > 0 ? numero+', ' : ''}${bairro.length > 0 ? bairro+', ' : ''}${cidade.length > 0 ? cidade+' - ' : ''}${estado.length > 0 ? estado+', ' : ''}${cep.length > 0 ? cep+', ' : ''}${pais.length > 0 ? pais : ''}`;

    // retorna informações
    return {
        endereco: enderecoFinal,
        coordenadas
    }

}

export async function consultaEnderecoPelaCoordenada(chave: string, coordenadas: ICoordenadas) {
    const lat = coordenadas.latitude.toString();
    const lng = coordenadas.longitude.toString();
    const result = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=pt_BR&key=${chave}`,
    );
    const data = await result.json();
    return data as { results: GooglePlaceDetail[] };
}

export function verificaCorCategoria(nomeCategoria: string) {

    let cor = '#FFF';
    
    switch(nomeCategoria) {
        case 'futebol':
            cor = 'rgba(177, 255, 140, 0.9)';
            break;
        case 'basquete':
            cor = 'rgba(255, 197, 129, 0.9)';
            break;
        case 'tênis':
            cor = 'rgba(255, 242, 125, 0.9)';
            break;
        case 'tênis de mesa': 
            cor = 'rgba(252, 120, 112, 0.9)';
            break;
        case 'handebol':
            cor = 'rgba(193, 157, 82, 0.9)';
            break;
        case 'futsal': 
            cor = 'rgba(219, 227, 126, 0.9)';
            break;
        case 'natação':
            cor = 'rgba(166, 225, 255, 0.9)';
            break;
        case 'vôlei':
            cor = 'rgba(255, 255, 255, 0.9)';
            break;
        default:
            cor = '#FFF';
            break;
        
    }

    return cor;

}

export function formataDuracao(dur: string) {
    const horaDuracao = parseInt(dur.split(':')[0]);
    const minutoDuracao = parseInt(dur.split(':')[1]);
    const horaRetorno = (horaDuracao > 0) ? `${horaDuracao}h `: '';
    const minutoRetorno = (minutoDuracao > 0) ? `${minutoDuracao}min` : '';
    return `${horaRetorno}${(horaRetorno.length > 0 && minutoRetorno.length > 0) ? 'e ' : ''}${minutoRetorno}`;
}

export function dataFusoBr(data: string | Date) {
    return new Date(data).toLocaleDateString('pt-BR', {timeZone:'America/Sao_Paulo'});
}

export function horaFusoBr(data: string | Date) {
    return new Date(data).toLocaleTimeString('pt-BR', {timeZone:'America/Sao_Paulo'});
}

export function retornaCoordenadasDelta ({
    accuracy,
    latitude,
    longitude,
}: ICoordenadasDelta) {

    // localizacao.coords.accuracy
    // https://github.com/react-native-maps/react-native-maps/issues/505#issuecomment-354029449

    // um grau de latitude em metros
    const oneDegreeOfLatitudeInMeters = 111.32 * 1000;

    // monta o delta da latitude
    let latDelta = (accuracy || 0.0043) / oneDegreeOfLatitudeInMeters;

    // monta o delta da longitude
    let lngDelta = (accuracy || 0.0034) / (oneDegreeOfLatitudeInMeters * Math.cos(latitude * (Math.PI / 180)));

    // retorna objeto com as coordenadas delta
    return {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta
    }

}

export const { format } = new Intl.DateTimeFormat(
    'pt-BR',
    {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: 'UTC'
    }
)