import { Column, Entity, PrimaryColumn } from "typeorm";

export interface IReport {
  telegram_id: number;
  minutes: number;
  visits: number;
  publications: number;
  videos: number;
  month?: Date;
}

@Entity("reports")
export class Report implements IReport {
  @PrimaryColumn()
  public telegram_id: number;

  @Column()
  public minutes: number;

  @Column()
  public publications: number;

  @Column()
  public visits: number;

  @Column()
  public videos: number;

  @Column()
  public month?: Date;
}
