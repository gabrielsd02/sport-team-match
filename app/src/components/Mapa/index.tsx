import { memo } from "react";
import MapView from "react-native-maps";

import { retornaCoordenadasDelta } from "../../functions";
import { IMapaProps } from "./interfaceMapa";

function Mapa({
    children,
    cliqueMapa,
    localizacaoUsuario
}: IMapaProps) {
    
    return (
        <MapView
            initialRegion={(localizacaoUsuario && Object.keys(localizacaoUsuario).length > 0) ? retornaCoordenadasDelta(localizacaoUsuario) : undefined}
            provider={'google'}
            showsScale={false}
            showsBuildings
            style={{
                width: '100%',
                height: '100%',
                flexGrow: 1,
                minHeight: '100%'
            }}
            onPress={(e) => {
                if(cliqueMapa) cliqueMapa(e.nativeEvent.coordinate);
            }}
            showsUserLocation={false}
            followsUserLocation={false}
            showsCompass={false}
            showsTraffic={false}
            showsIndoors={false}
            showsIndoorLevelPicker={false}
            toolbarEnabled
            loadingEnabled={true}
        >
            {children}
        </MapView>
    );

}

export default memo(Mapa);