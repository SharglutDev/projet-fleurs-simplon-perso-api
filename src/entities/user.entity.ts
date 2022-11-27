import { IsEmail, Length } from "class-validator";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  OneToMany,
} from "typeorm";
import Model from "./model.entity";
import { Plant } from "./plant.entity";
import bcrypt from "bcryptjs";

export enum RoleEnumType {
  USER = "user",
  ADMIN = "admin",
}

@Entity("users")
export class User extends Model {
  @Index("email_index")
  @Column({
    unique: true,
    nullable: false,
  })
  @IsEmail()
  email: string;

  @Column()
  @Length(8, 32)
  password: string;

  @Column({
    type: "enum",
    enum: RoleEnumType,
    default: RoleEnumType.USER,
  })
  role?: RoleEnumType;

  @OneToMany((type) => Plant, (plant) => plant.created_by)
  @JoinColumn()
  plants: Plant;

  //   toJSON() {
  //     return { ...this, password: undefined };
  //   }

  // DTO data transfer object

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }
}
