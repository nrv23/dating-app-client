import { IConnection } from './IConnection';

export interface IGroup {
    name: string;
    connections: IConnection[];
}