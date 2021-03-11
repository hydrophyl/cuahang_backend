#usr/bin/bash

read -p "Please enter new module name: z.B: users/cats/..: " name
echo "Your new module is named $name" 

lowercase=$(echo ${name::-1})
uppercase=$(echo ${lowercase^})

echo $lowercase
echo $uppercase

#real run
nest g module $name
nest g controller $name
nest g service $name
cd src/

#test command
#mkdir $name

cd $name
mkdir dto
mkdir schemas
touch dto/create-$lowercase.dto.ts
echo "export class Create"$uppercase"Dto {id:string;}" >> dto/create-$lowercase.dto.ts
touch schemas/$lowercase.schema.ts
echo "import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';import { Document } from 'mongoose';export type "$uppercase"Document = "$uppercase" & Document;@Schema()export class "$uppercase" {@Prop()id: string;@Prop()name: string;}export const "$uppercase"Schema = SchemaFactory.createForClass("$uppercase");" >> schemas/$lowercase.schema.ts

rm $name.controller.ts
touch $name.controller.ts
cat >> $name.controller.ts <<EOL
import {  Body,  Controller,  Delete,  Get,  Param,  Patch,  Post,} from '@nestjs/common';
import { Create${uppercase}Dto } from './dto/create-${lowercase}.dto';
import { ${uppercase}sService } from './${lowercase}s.service';
import { ${uppercase} } from './schemas/${lowercase}.schema';

@Controller('${lowercase}s')
export class ${uppercase}sController {
  constructor(private ${lowercase}sService: ${uppercase}sService) {}

  // get all ${lowercase}s
  @Get()
  async findAll(): Promise<${uppercase}[]> {
    return this.${lowercase}sService.findAll();
  }

  // create new ${lowercase}
  @Post()
  async create(@Body() create${uppercase}Dto: Create${uppercase}Dto) {
    const generatedId = await this.${lowercase}sService.create(create${uppercase}Dto);
    return { id: generatedId };
  }

  //find one ${lowercase}
  @Get(':id')
  async findSingle${uppercase}(@Param('id') id: string): Promise<${uppercase}> {
    return this.${lowercase}sService.findSingle${uppercase}(id);
  }

  // update ${lowercase} infos
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body('name') name: string,
  ) {
    await this.${lowercase}sService.update${uppercase}(id, name);
    return `${id} is updated`;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.${lowercase}sService.delete(id);
  }
}
EOL

rm $name.service.ts
touch $name.service.ts
cat >> ${name}.service.ts <<EOL
import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ${uppercase}, ${uppercase}Document } from './schemas/${lowercase}.schema';
import { Create${uppercase}Dto } from './dto/create-${lowercase}.dto';

@Injectable()
export class ${uppercase}sService {
  constructor(
    @InjectModel('${uppercase}') private readonly ${lowercase}Model: Model<${uppercase}Document>,
  ) {}

  //string as output because we need the generated id
  async create(create${uppercase}Dto: Create${uppercase}Dto): Promise<String> {
    const new${uppercase} = new this.${lowercase}Model(create${uppercase}Dto);
    const resp = await new${uppercase}.save();
    return resp._id;
  }

  async findAll(): Promise<${uppercase}[]> {
    const ${lowercase}s = await this.${lowercase}Model.find().exec();
    return ${lowercase}s.map((${lowercase}) => ({
      id: ${lowercase}._id,
      name: ${lowercase}.name,
    }));
  }

  //return optional characters of object
  async findSingle${uppercase}(id: string): Promise<${uppercase}> {
    const ${lowercase} = await this.${lowercase}Model.findById(id);
    if (!${lowercase}) {
      throw new NotFoundException('Could not find the ${lowercase}');
    }
    return { id: ${lowercase}._id, name: ${lowercase}.name };
  }

	async update${uppercase}(id: string, name: string) {
    const updated${uppercase} = await this.${lowercase}Model.findById(id);
    if (!updated${uppercase}) {
      throw new NotFoundException('Could not find the ${lowercase}');
    }
    if (name) {
      updated${uppercase}.name = name;
    }
    updated${uppercase}.save();
  }

  async delete(id: string) {
    const res = await this.${lowercase}Model.deleteOne({ _id: id }).exec();
    if (res.n === 0) {
      throw new NotFoundException('Could not find the ${lowercase}');
    }
    return 'Deleted';
  }
}
EOL

rm $name.module.ts
touch $name.module.ts
cat >> $name.module.ts <<EOL
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ${uppercase}sController } from './${lowercase}s.controller';
import { ${uppercase}sService } from './${lowercase}s.service';
import { ${uppercase}, ${uppercase}Schema } from './schemas/${lowercase}.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: '$name', schema: ${uppercase}Schema }])],
  controllers: [${uppercase}sController],
  providers: [${uppercase}sService],
  exports: [${uppercase}sService],
})
export class ${uppercase}sModule {}
EOL
