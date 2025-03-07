import { Association, CreationOptional, DataTypes, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import { Adventure } from "./adventure";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare discordId: BigInt
    declare name?: string
    declare apiKey: CreationOptional<string>

    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>

    declare getAdventures: HasManyGetAssociationsMixin<Adventure>
    declare createAdventure: HasManyCreateAssociationMixin<Adventure, 'ownerId'>

    declare adventures?: NonAttribute<Adventure[]>;

    declare static associations: {
        adventures: Association<User, Adventure>
    }
}

export default function init(db: Sequelize) {
    return User.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        
        discordId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
        name: { type: DataTypes.STRING(32), allowNull: false },
        apiKey: DataTypes.CHAR(32),

        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedAt: { type: DataTypes.DATE, allowNull: false }
    }, {
        sequelize: db
    });
}