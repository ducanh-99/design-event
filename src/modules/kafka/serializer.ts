import { Serializer } from '@nestjs/microservices';
import { KafkaRequest } from '@nestjs/microservices/serializers/kafka-request.serializer';
import { isNil, isObject, isPlainObject, isString, isUndefined } from 'lodash';
import * as JSONbig from 'json-bigint';

export class CustomKafkaSerializer
  implements Serializer<any, KafkaRequest | Promise<KafkaRequest>>
{
  serialize(value: any) {
    const isNotKafkaMessage =
      isNil(value) ||
      !isObject(value) ||
      (!('key' in value) && !('value' in value));

    if (isNotKafkaMessage) {
      value = { value };
    }
    value.value = this.encode(value.value);
    if (!isNil(value.key)) {
      value.key = this.encode(value.key);
    }
    if (isNil(value.headers)) {
      value.headers = {};
    }
    return value;
  }

  public encode(value: any): Buffer | string | null {
    const isObjectOrArray =
      !isNil(value) && !isString(value) && !Buffer.isBuffer(value);

    if (isObjectOrArray) {
      return isPlainObject(value) || Array.isArray(value)
        ? JSONbig.stringify(value)
        : value.toString();
    } else if (isUndefined(value)) {
      return null;
    }
    return value;
  }
}
