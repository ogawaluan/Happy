import { 
  Entity, 
  Column, 
  PrimaryColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  Generated, 
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('user_tokens')
class UserTokens {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  @Generated('uuid')
  token: string;

  @Column()
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export default UserTokens;