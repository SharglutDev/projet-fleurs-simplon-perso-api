import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";
import Model from "./model.entity";
import { User } from "./user.entity";

@Entity("plant")
export class Plant extends Model {
  @Column({
    nullable: false,
    type: "varchar",
    length: 30,
  })
  name: string;

  @Column({ nullable: false })
  unitprice_ati: number;

  @Column({ nullable: false })
  quantity: number;

  @Column({ nullable: false, type: "varchar", length: 50 })
  category: string;

  @Column({ nullable: false })
  rating: number;

  @Column({ nullable: false, type: "varchar", length: 50 })
  url_picture: number;

  @ManyToOne((type) => User, (user) => user.plants)
  @JoinColumn()
  created_by: User;
}
