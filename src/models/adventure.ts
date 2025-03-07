import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import { User } from "./user";

export class Adventure extends Model<InferAttributes<Adventure>, InferCreationAttributes<Adventure>> {
    declare id: CreationOptional<string>;
    declare ownerId: ForeignKey<User['id']>;
    declare minimumLevel: number;
    declare maximumLevel: number;
    declare minimumPlayers: number;
    declare maximumPlayers: number;

    declare owner?: NonAttribute<User>;

    declare createdAt: CreationOptional<Date>;
    declare modifiedAt: CreationOptional<Date>;
}

export default function init(db: Sequelize) {
    return Adventure.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        minimumLevel: {
            field: 'min_level',
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false,
        },
        maximumLevel: {
            field: 'max_level',
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false,
        },
        minimumPlayers: {
            field: 'min_players',
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false,
        },
        maximumPlayers: {
            field: 'max_players',
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false,
        },
        createdAt: DataTypes.DATE,
        modifiedAt: DataTypes.DATE
    }, { sequelize: db });
}