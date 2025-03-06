export interface ILocalizacao {
    accuracy: number | null;
    altitude?: number | null;
    altitudeAccuracy?: number | null;
    heading?: number | null;
    latitude: number;
    longitude: number;
    speed?: number | null;
}