import { 
    memo, 
    useRef, 
    useState
} from "react";
import { Modal } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { DateTime } from "luxon";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import { 
    BotaoData,
    BotaoFechar,
    BotaoFiltro,
    BotaoSalvar,
    ContainerBotoes,
    ContainerDataHora,
    ContainerFiltros, 
    ContainerLabelFiltro, 
    ContainerTextoData, 
    FundoPressionavel 
} from "./styles";
import { 
    IFiltrosProps, 
    IOrdenacao 
} from './interfaceFiltros';
import { Texto } from "../../../components";
import { ICategoria } from "../../../interfaces/ICategoria";
import { Picker } from "@react-native-picker/picker";
import { primeiraLetraMaiuscula } from "../../../functions";

function Filtros({
    fechar,
    categorias,
    textoTamanho,
    filtros,
    alterarFiltros
}: IFiltrosProps) {

    const horaVerificacao = filtros.hora ? filtros.hora.split(':') : null;
    const arrayOrdenacao = [
        {
            nome: 'Decrescente',
            valor: 'desc'
        },
        {
            nome: 'Ascendente',
            valor: 'asc'
        }
    ];
    
    const refPickerCategoria = useRef<Picker<ICategoria | null>>();
    const refPickerOrdem = useRef<Picker<IOrdenacao | null>>();
    
    const [categoriaFiltro, setCategoriaFiltro] = useState<ICategoria | null>(filtros?.categoria ?? null);
    const [ordenacaoFiltro, setOrdenacaoFiltro] = useState<IOrdenacao | null>(
        filtros.ordenacao ? arrayOrdenacao.find(o => o.valor === filtros.ordenacao)! : arrayOrdenacao[0]
    );
    const [data, setData] = useState<Date | undefined>(filtros.data ? new Date(new Date(filtros.data).setHours(24)) : undefined);
    const [hora, setHora] = useState<string | null>(horaVerificacao ? `${horaVerificacao[0]+':'+horaVerificacao[1]}` : null);      
    
    const resgataData = () => DateTimePickerAndroid.open({
        value: data || new Date(),
        display: 'calendar',
        mode: 'date',
        onChange(event, date) {
            if(event.type === 'dismissed') return;
            setData(date);                                    
        }
    });
    
    const resgataHora = () => {
        const valor = hora ? 
            new Date(`${data?.toISOString().split('T')[0] + ' ' + hora + ':00'}`) : 
            new Date()
        ;
        DateTimePickerAndroid.open({
            value: valor,
            display: 'clock',
            is24Hour: true,        
            mode: 'time',
            onChange(event, date) {
                if(!date || event.type === 'dismissed') return;
                setHora(
                    date.toLocaleTimeString().split(':')[0] + ':' +
                    date.toLocaleTimeString().split(':')[1]
                );                                    
            }
        })
    };
    
    return (
        <Modal
            animationType="fade"
            visible
            onRequestClose={fechar}
            transparent
            style={{ position: 'relative' }}
        >
            <FundoPressionavel
                onPress={fechar}
            >
                <ContainerFiltros
                    style={{
                        shadowColor: 'white',
                        shadowOpacity: 0.25,
                        justifyContent: 'center',
                        elevation: 6
                    }}
                    onPress={(e) => e.preventDefault()}
                >
                    <Texto
                        style={{
                            fontWeight: 'bold',
                            fontSize: textoTamanho.medio,
                            textDecorationLine: 'underline'
                        }}
                    >
                        Filtros
                    </Texto>
                    <ContainerLabelFiltro>
                        <Texto
                            style={{
                                fontWeight: 'bold',
                                fontSize: textoTamanho.abaixoNormal
                            }}
                        >
                            Categoria
                        </Texto>
                    </ContainerLabelFiltro>
                    <BotaoFiltro
                        style={{
                            justifyContent: 'space-between'
                        }}
                        onPress={() => refPickerCategoria?.current?.focus()}
                    >
                        <Texto
                            style={{
                                fontSize: textoTamanho.abaixoNormal,
                                opacity: categoriaFiltro ? 1 : 0.5
                            }}
                        >
                            {categoriaFiltro ? primeiraLetraMaiuscula(categoriaFiltro.nome) : 'Categoria'}
                        </Texto>
                        <FontAwesome 
                            name="caret-down" 
                            size={28} 
                            color="white" 
                        />
                        <Picker
                            ref={(ref) => {if(ref) refPickerCategoria.current = ref}}
                            selectedValue={categoriaFiltro}
                            onValueChange={(itemValue, itemIndex) => {
                                setCategoriaFiltro(itemValue)
                            }}
                            mode="dialog"
                            style={{
                                display: 'none'
                            }}        
                        >
                            <Picker.Item                                 
                                key={0}
                                label={"Selecione uma categoria"}
                                color={"gray"}
                                enabled={false}
                                style={{ 
                                    fontSize: textoTamanho.normal
                                }}
                            />
                            {categorias.map((categoria, index) => (                                
                                <Picker.Item                                 
                                    key={index + 1}
                                    label={primeiraLetraMaiuscula(categoria.nome)}
                                    value={categoria}
                                    color={"black"}
                                    style={{ 
                                        fontSize: textoTamanho.normal
                                    }}
                                />
                            ))}                            
                        </Picker>
                    </BotaoFiltro>
                    <ContainerDataHora>
                        <ContainerTextoData>
                            <Texto
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: textoTamanho.abaixoNormal
                                }}
                            >
                                Data
                            </Texto>
                            <BotaoData
                                onPress={() => resgataData()}
                            >
                                <Texto
                                    style={{
                                        fontSize: textoTamanho.abaixoNormal,
                                        opacity: data ? 1 : 0.5
                                    }}
                                >
                                    {data ? data.toLocaleDateString() : 'Data'}
                                </Texto>
                            </BotaoData>
                        </ContainerTextoData>
                        <ContainerTextoData>
                            <Texto
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: textoTamanho.abaixoNormal
                                }}
                            >
                                Hora
                            </Texto>
                            <BotaoData
                                onPress={() => resgataHora()}
                            >
                                <Texto
                                    style={{
                                        fontSize: textoTamanho.abaixoNormal,
                                        opacity: hora ? 1 : 0.5
                                    }}
                                >
                                    {hora ? hora : 'Hora'}
                                </Texto>
                            </BotaoData>
                        </ContainerTextoData>
                    </ContainerDataHora>
                    <ContainerLabelFiltro>
                        <Texto
                            style={{
                                fontWeight: 'bold',
                                fontSize: textoTamanho.abaixoNormal
                            }}
                        >
                            Ordenar por:
                        </Texto>
                    </ContainerLabelFiltro>
                    <BotaoFiltro
                        style={{
                            justifyContent: 'space-between'
                        }}
                        onPress={() => refPickerOrdem?.current?.focus()}
                    >
                        <Texto
                            style={{
                                fontSize: textoTamanho.abaixoNormal,
                                opacity: ordenacaoFiltro ? 1 : 0.5
                            }}
                        >
                            {ordenacaoFiltro ? ordenacaoFiltro.nome : 'Ordenação'}
                        </Texto>
                        <FontAwesome 
                            name="caret-down" 
                            size={28} 
                            color="white" 
                        />
                        <Picker
                            ref={(ref) => {
                                if(ref) refPickerOrdem.current = ref;
                            }}
                            selectedValue={ordenacaoFiltro}
                            onValueChange={(itemValue, itemIndex) => {
                                setOrdenacaoFiltro(itemValue)
                            }}
                            mode="dialog"
                            style={{ display: 'none' }}        
                        >
                            <Picker.Item                                 
                                key={0}
                                label={"Selecione uma ordenação"}
                                color={"gray"}
                                enabled={false}
                                style={{ 
                                    fontSize: textoTamanho.normal
                                }}
                            />
                            {arrayOrdenacao.map((ordem, index) => (                                
                                <Picker.Item                                 
                                    key={index + 1}
                                    label={ordem.nome}
                                    value={ordem}
                                    color={"black"}
                                    style={{ 
                                        fontSize: textoTamanho.normal
                                    }}
                                />
                            ))}                            
                        </Picker>
                    </BotaoFiltro>
                    <ContainerBotoes>
                        <BotaoFechar
                            onPress={() =>  fechar()}
                        >
                            <Texto
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: textoTamanho.quasePequeno
                                }}
                                numberOfLines={1}
                            >
                                Fechar
                            </Texto>
                        </BotaoFechar>
                        <BotaoSalvar
                            onPress={() => {
                                fechar();
                                alterarFiltros({
                                    categoria: categoriaFiltro,
                                    ordenacao: ordenacaoFiltro?.valor,
                                    data: data ? DateTime.fromJSDate(data).toFormat('yyyy-MM-dd') : null,
                                    hora: hora ? hora+':00' : null
                                });
                            }}
                        >
                            <Texto
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: textoTamanho.quasePequeno
                                }}
                                numberOfLines={1}
                            >
                                Filtrar
                            </Texto>
                        </BotaoSalvar>
                    </ContainerBotoes>
                </ContainerFiltros>
            </FundoPressionavel>
        </Modal>
    );

}

export default memo(Filtros);