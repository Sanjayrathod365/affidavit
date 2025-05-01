
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Patient
 * 
 */
export type Patient = $Result.DefaultSelection<Prisma.$PatientPayload>
/**
 * Model Provider
 * 
 */
export type Provider = $Result.DefaultSelection<Prisma.$ProviderPayload>
/**
 * Model PatientProvider
 * 
 */
export type PatientProvider = $Result.DefaultSelection<Prisma.$PatientProviderPayload>
/**
 * Model AffidavitTemplate
 * 
 */
export type AffidavitTemplate = $Result.DefaultSelection<Prisma.$AffidavitTemplatePayload>
/**
 * Model Affidavit
 * 
 */
export type Affidavit = $Result.DefaultSelection<Prisma.$AffidavitPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  ADMIN: 'ADMIN',
  PROVIDER: 'PROVIDER',
  STAFF: 'STAFF'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const RequestType: {
  BR_MR_WITH_AFFIDAVIT: 'BR_MR_WITH_AFFIDAVIT',
  BR_MR_WITHOUT_AFFIDAVIT: 'BR_MR_WITHOUT_AFFIDAVIT',
  BR_WITH_AFFIDAVIT: 'BR_WITH_AFFIDAVIT',
  BR_WITHOUT_AFFIDAVIT: 'BR_WITHOUT_AFFIDAVIT',
  MR_WITH_AFFIDAVIT: 'MR_WITH_AFFIDAVIT',
  MR_WITHOUT_AFFIDAVIT: 'MR_WITHOUT_AFFIDAVIT'
};

export type RequestType = (typeof RequestType)[keyof typeof RequestType]


export const DosType: {
  DOI_TO_PRESENT: 'DOI_TO_PRESENT',
  DOI_TO_NEXT_7_DAYS: 'DOI_TO_NEXT_7_DAYS',
  CUSTOM: 'CUSTOM'
};

export type DosType = (typeof DosType)[keyof typeof DosType]


export const AffidavitStatus: {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export type AffidavitStatus = (typeof AffidavitStatus)[keyof typeof AffidavitStatus]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type RequestType = $Enums.RequestType

export const RequestType: typeof $Enums.RequestType

export type DosType = $Enums.DosType

export const DosType: typeof $Enums.DosType

export type AffidavitStatus = $Enums.AffidavitStatus

export const AffidavitStatus: typeof $Enums.AffidavitStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.patient`: Exposes CRUD operations for the **Patient** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Patients
    * const patients = await prisma.patient.findMany()
    * ```
    */
  get patient(): Prisma.PatientDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.provider`: Exposes CRUD operations for the **Provider** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Providers
    * const providers = await prisma.provider.findMany()
    * ```
    */
  get provider(): Prisma.ProviderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.patientProvider`: Exposes CRUD operations for the **PatientProvider** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PatientProviders
    * const patientProviders = await prisma.patientProvider.findMany()
    * ```
    */
  get patientProvider(): Prisma.PatientProviderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.affidavitTemplate`: Exposes CRUD operations for the **AffidavitTemplate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AffidavitTemplates
    * const affidavitTemplates = await prisma.affidavitTemplate.findMany()
    * ```
    */
  get affidavitTemplate(): Prisma.AffidavitTemplateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.affidavit`: Exposes CRUD operations for the **Affidavit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Affidavits
    * const affidavits = await prisma.affidavit.findMany()
    * ```
    */
  get affidavit(): Prisma.AffidavitDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Patient: 'Patient',
    Provider: 'Provider',
    PatientProvider: 'PatientProvider',
    AffidavitTemplate: 'AffidavitTemplate',
    Affidavit: 'Affidavit'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "patient" | "provider" | "patientProvider" | "affidavitTemplate" | "affidavit"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Patient: {
        payload: Prisma.$PatientPayload<ExtArgs>
        fields: Prisma.PatientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          findFirst: {
            args: Prisma.PatientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          findMany: {
            args: Prisma.PatientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          create: {
            args: Prisma.PatientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          createMany: {
            args: Prisma.PatientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PatientCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          delete: {
            args: Prisma.PatientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          update: {
            args: Prisma.PatientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          deleteMany: {
            args: Prisma.PatientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PatientUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          upsert: {
            args: Prisma.PatientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          aggregate: {
            args: Prisma.PatientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatient>
          }
          groupBy: {
            args: Prisma.PatientGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatientGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatientCountArgs<ExtArgs>
            result: $Utils.Optional<PatientCountAggregateOutputType> | number
          }
        }
      }
      Provider: {
        payload: Prisma.$ProviderPayload<ExtArgs>
        fields: Prisma.ProviderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProviderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProviderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderPayload>
          }
          findFirst: {
            args: Prisma.ProviderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProviderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderPayload>
          }
          findMany: {
            args: Prisma.ProviderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderPayload>[]
          }
          create: {
            args: Prisma.ProviderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderPayload>
          }
          createMany: {
            args: Prisma.ProviderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProviderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderPayload>[]
          }
          delete: {
            args: Prisma.ProviderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderPayload>
          }
          update: {
            args: Prisma.ProviderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderPayload>
          }
          deleteMany: {
            args: Prisma.ProviderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProviderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProviderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderPayload>[]
          }
          upsert: {
            args: Prisma.ProviderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderPayload>
          }
          aggregate: {
            args: Prisma.ProviderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProvider>
          }
          groupBy: {
            args: Prisma.ProviderGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProviderGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProviderCountArgs<ExtArgs>
            result: $Utils.Optional<ProviderCountAggregateOutputType> | number
          }
        }
      }
      PatientProvider: {
        payload: Prisma.$PatientProviderPayload<ExtArgs>
        fields: Prisma.PatientProviderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatientProviderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientProviderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatientProviderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientProviderPayload>
          }
          findFirst: {
            args: Prisma.PatientProviderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientProviderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatientProviderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientProviderPayload>
          }
          findMany: {
            args: Prisma.PatientProviderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientProviderPayload>[]
          }
          create: {
            args: Prisma.PatientProviderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientProviderPayload>
          }
          createMany: {
            args: Prisma.PatientProviderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PatientProviderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientProviderPayload>[]
          }
          delete: {
            args: Prisma.PatientProviderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientProviderPayload>
          }
          update: {
            args: Prisma.PatientProviderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientProviderPayload>
          }
          deleteMany: {
            args: Prisma.PatientProviderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatientProviderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PatientProviderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientProviderPayload>[]
          }
          upsert: {
            args: Prisma.PatientProviderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientProviderPayload>
          }
          aggregate: {
            args: Prisma.PatientProviderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatientProvider>
          }
          groupBy: {
            args: Prisma.PatientProviderGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatientProviderGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatientProviderCountArgs<ExtArgs>
            result: $Utils.Optional<PatientProviderCountAggregateOutputType> | number
          }
        }
      }
      AffidavitTemplate: {
        payload: Prisma.$AffidavitTemplatePayload<ExtArgs>
        fields: Prisma.AffidavitTemplateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AffidavitTemplateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AffidavitTemplatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AffidavitTemplateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AffidavitTemplatePayload>
          }
          findFirst: {
            args: Prisma.AffidavitTemplateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AffidavitTemplatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AffidavitTemplateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AffidavitTemplatePayload>
          }
          findMany: {
            args: Prisma.AffidavitTemplateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AffidavitTemplatePayload>[]
          }
          create: {
            args: Prisma.AffidavitTemplateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AffidavitTemplatePayload>
          }
          createMany: {
            args: Prisma.AffidavitTemplateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AffidavitTemplateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AffidavitTemplatePayload>[]
          }
          delete: {
            args: Prisma.AffidavitTemplateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AffidavitTemplatePayload>
          }
          update: {
            args: Prisma.AffidavitTemplateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AffidavitTemplatePayload>
          }
          deleteMany: {
            args: Prisma.AffidavitTemplateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AffidavitTemplateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AffidavitTemplateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AffidavitTemplatePayload>[]
          }
          upsert: {
            args: Prisma.AffidavitTemplateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AffidavitTemplatePayload>
          }
          aggregate: {
            args: Prisma.AffidavitTemplateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAffidavitTemplate>
          }
          groupBy: {
            args: Prisma.AffidavitTemplateGroupByArgs<ExtArgs>
            result: $Utils.Optional<AffidavitTemplateGroupByOutputType>[]
          }
          count: {
            args: Prisma.AffidavitTemplateCountArgs<ExtArgs>
            result: $Utils.Optional<AffidavitTemplateCountAggregateOutputType> | number
          }
        }
      }
      Affidavit: {
        payload: Prisma.$AffidavitPayload<ExtArgs>
        fields: Prisma.AffidavitFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AffidavitFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AffidavitPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AffidavitFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AffidavitPayload>
          }
          findFirst: {
            args: Prisma.AffidavitFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AffidavitPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AffidavitFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AffidavitPayload>
          }
          findMany: {
            args: Prisma.AffidavitFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AffidavitPayload>[]
          }
          create: {
            args: Prisma.AffidavitCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AffidavitPayload>
          }
          createMany: {
            args: Prisma.AffidavitCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AffidavitCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AffidavitPayload>[]
          }
          delete: {
            args: Prisma.AffidavitDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AffidavitPayload>
          }
          update: {
            args: Prisma.AffidavitUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AffidavitPayload>
          }
          deleteMany: {
            args: Prisma.AffidavitDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AffidavitUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AffidavitUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AffidavitPayload>[]
          }
          upsert: {
            args: Prisma.AffidavitUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AffidavitPayload>
          }
          aggregate: {
            args: Prisma.AffidavitAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAffidavit>
          }
          groupBy: {
            args: Prisma.AffidavitGroupByArgs<ExtArgs>
            result: $Utils.Optional<AffidavitGroupByOutputType>[]
          }
          count: {
            args: Prisma.AffidavitCountArgs<ExtArgs>
            result: $Utils.Optional<AffidavitCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    patient?: PatientOmit
    provider?: ProviderOmit
    patientProvider?: PatientProviderOmit
    affidavitTemplate?: AffidavitTemplateOmit
    affidavit?: AffidavitOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type PatientCountOutputType
   */

  export type PatientCountOutputType = {
    providers: number
    affidavits: number
  }

  export type PatientCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    providers?: boolean | PatientCountOutputTypeCountProvidersArgs
    affidavits?: boolean | PatientCountOutputTypeCountAffidavitsArgs
  }

  // Custom InputTypes
  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientCountOutputType
     */
    select?: PatientCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountProvidersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientProviderWhereInput
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountAffidavitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AffidavitWhereInput
  }


  /**
   * Count Type ProviderCountOutputType
   */

  export type ProviderCountOutputType = {
    patients: number
    affidavits: number
  }

  export type ProviderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patients?: boolean | ProviderCountOutputTypeCountPatientsArgs
    affidavits?: boolean | ProviderCountOutputTypeCountAffidavitsArgs
  }

  // Custom InputTypes
  /**
   * ProviderCountOutputType without action
   */
  export type ProviderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCountOutputType
     */
    select?: ProviderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProviderCountOutputType without action
   */
  export type ProviderCountOutputTypeCountPatientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientProviderWhereInput
  }

  /**
   * ProviderCountOutputType without action
   */
  export type ProviderCountOutputTypeCountAffidavitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AffidavitWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    role: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string | null
    email: string
    password: string
    role: $Enums.UserRole
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "role" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      email: string
      password: string
      role: $Enums.UserRole
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
  }


  /**
   * Model Patient
   */

  export type AggregatePatient = {
    _count: PatientCountAggregateOutputType | null
    _min: PatientMinAggregateOutputType | null
    _max: PatientMaxAggregateOutputType | null
  }

  export type PatientMinAggregateOutputType = {
    id: string | null
    patientName: string | null
    dateOfBirth: Date | null
    dateOfInjury: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PatientMaxAggregateOutputType = {
    id: string | null
    patientName: string | null
    dateOfBirth: Date | null
    dateOfInjury: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PatientCountAggregateOutputType = {
    id: number
    patientName: number
    dateOfBirth: number
    dateOfInjury: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PatientMinAggregateInputType = {
    id?: true
    patientName?: true
    dateOfBirth?: true
    dateOfInjury?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PatientMaxAggregateInputType = {
    id?: true
    patientName?: true
    dateOfBirth?: true
    dateOfInjury?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PatientCountAggregateInputType = {
    id?: true
    patientName?: true
    dateOfBirth?: true
    dateOfInjury?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PatientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Patient to aggregate.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Patients
    **/
    _count?: true | PatientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientMaxAggregateInputType
  }

  export type GetPatientAggregateType<T extends PatientAggregateArgs> = {
        [P in keyof T & keyof AggregatePatient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatient[P]>
      : GetScalarType<T[P], AggregatePatient[P]>
  }




  export type PatientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientWhereInput
    orderBy?: PatientOrderByWithAggregationInput | PatientOrderByWithAggregationInput[]
    by: PatientScalarFieldEnum[] | PatientScalarFieldEnum
    having?: PatientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientCountAggregateInputType | true
    _min?: PatientMinAggregateInputType
    _max?: PatientMaxAggregateInputType
  }

  export type PatientGroupByOutputType = {
    id: string
    patientName: string
    dateOfBirth: Date
    dateOfInjury: Date
    createdAt: Date
    updatedAt: Date
    _count: PatientCountAggregateOutputType | null
    _min: PatientMinAggregateOutputType | null
    _max: PatientMaxAggregateOutputType | null
  }

  type GetPatientGroupByPayload<T extends PatientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientGroupByOutputType[P]>
            : GetScalarType<T[P], PatientGroupByOutputType[P]>
        }
      >
    >


  export type PatientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientName?: boolean
    dateOfBirth?: boolean
    dateOfInjury?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    providers?: boolean | Patient$providersArgs<ExtArgs>
    affidavits?: boolean | Patient$affidavitsArgs<ExtArgs>
    _count?: boolean | PatientCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patient"]>

  export type PatientSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientName?: boolean
    dateOfBirth?: boolean
    dateOfInjury?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["patient"]>

  export type PatientSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientName?: boolean
    dateOfBirth?: boolean
    dateOfInjury?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["patient"]>

  export type PatientSelectScalar = {
    id?: boolean
    patientName?: boolean
    dateOfBirth?: boolean
    dateOfInjury?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PatientOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "patientName" | "dateOfBirth" | "dateOfInjury" | "createdAt" | "updatedAt", ExtArgs["result"]["patient"]>
  export type PatientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    providers?: boolean | Patient$providersArgs<ExtArgs>
    affidavits?: boolean | Patient$affidavitsArgs<ExtArgs>
    _count?: boolean | PatientCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PatientIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PatientIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PatientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Patient"
    objects: {
      providers: Prisma.$PatientProviderPayload<ExtArgs>[]
      affidavits: Prisma.$AffidavitPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientName: string
      dateOfBirth: Date
      dateOfInjury: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["patient"]>
    composites: {}
  }

  type PatientGetPayload<S extends boolean | null | undefined | PatientDefaultArgs> = $Result.GetResult<Prisma.$PatientPayload, S>

  type PatientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PatientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PatientCountAggregateInputType | true
    }

  export interface PatientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Patient'], meta: { name: 'Patient' } }
    /**
     * Find zero or one Patient that matches the filter.
     * @param {PatientFindUniqueArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientFindUniqueArgs>(args: SelectSubset<T, PatientFindUniqueArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Patient that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PatientFindUniqueOrThrowArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientFindUniqueOrThrowArgs>(args: SelectSubset<T, PatientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Patient that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindFirstArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientFindFirstArgs>(args?: SelectSubset<T, PatientFindFirstArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Patient that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindFirstOrThrowArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientFindFirstOrThrowArgs>(args?: SelectSubset<T, PatientFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Patients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Patients
     * const patients = await prisma.patient.findMany()
     * 
     * // Get first 10 Patients
     * const patients = await prisma.patient.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientWithIdOnly = await prisma.patient.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatientFindManyArgs>(args?: SelectSubset<T, PatientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Patient.
     * @param {PatientCreateArgs} args - Arguments to create a Patient.
     * @example
     * // Create one Patient
     * const Patient = await prisma.patient.create({
     *   data: {
     *     // ... data to create a Patient
     *   }
     * })
     * 
     */
    create<T extends PatientCreateArgs>(args: SelectSubset<T, PatientCreateArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Patients.
     * @param {PatientCreateManyArgs} args - Arguments to create many Patients.
     * @example
     * // Create many Patients
     * const patient = await prisma.patient.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatientCreateManyArgs>(args?: SelectSubset<T, PatientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Patients and returns the data saved in the database.
     * @param {PatientCreateManyAndReturnArgs} args - Arguments to create many Patients.
     * @example
     * // Create many Patients
     * const patient = await prisma.patient.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Patients and only return the `id`
     * const patientWithIdOnly = await prisma.patient.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PatientCreateManyAndReturnArgs>(args?: SelectSubset<T, PatientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Patient.
     * @param {PatientDeleteArgs} args - Arguments to delete one Patient.
     * @example
     * // Delete one Patient
     * const Patient = await prisma.patient.delete({
     *   where: {
     *     // ... filter to delete one Patient
     *   }
     * })
     * 
     */
    delete<T extends PatientDeleteArgs>(args: SelectSubset<T, PatientDeleteArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Patient.
     * @param {PatientUpdateArgs} args - Arguments to update one Patient.
     * @example
     * // Update one Patient
     * const patient = await prisma.patient.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatientUpdateArgs>(args: SelectSubset<T, PatientUpdateArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Patients.
     * @param {PatientDeleteManyArgs} args - Arguments to filter Patients to delete.
     * @example
     * // Delete a few Patients
     * const { count } = await prisma.patient.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatientDeleteManyArgs>(args?: SelectSubset<T, PatientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Patients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Patients
     * const patient = await prisma.patient.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatientUpdateManyArgs>(args: SelectSubset<T, PatientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Patients and returns the data updated in the database.
     * @param {PatientUpdateManyAndReturnArgs} args - Arguments to update many Patients.
     * @example
     * // Update many Patients
     * const patient = await prisma.patient.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Patients and only return the `id`
     * const patientWithIdOnly = await prisma.patient.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PatientUpdateManyAndReturnArgs>(args: SelectSubset<T, PatientUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Patient.
     * @param {PatientUpsertArgs} args - Arguments to update or create a Patient.
     * @example
     * // Update or create a Patient
     * const patient = await prisma.patient.upsert({
     *   create: {
     *     // ... data to create a Patient
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Patient we want to update
     *   }
     * })
     */
    upsert<T extends PatientUpsertArgs>(args: SelectSubset<T, PatientUpsertArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Patients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientCountArgs} args - Arguments to filter Patients to count.
     * @example
     * // Count the number of Patients
     * const count = await prisma.patient.count({
     *   where: {
     *     // ... the filter for the Patients we want to count
     *   }
     * })
    **/
    count<T extends PatientCountArgs>(
      args?: Subset<T, PatientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Patient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PatientAggregateArgs>(args: Subset<T, PatientAggregateArgs>): Prisma.PrismaPromise<GetPatientAggregateType<T>>

    /**
     * Group by Patient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PatientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientGroupByArgs['orderBy'] }
        : { orderBy?: PatientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PatientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Patient model
   */
  readonly fields: PatientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Patient.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    providers<T extends Patient$providersArgs<ExtArgs> = {}>(args?: Subset<T, Patient$providersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientProviderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    affidavits<T extends Patient$affidavitsArgs<ExtArgs> = {}>(args?: Subset<T, Patient$affidavitsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AffidavitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Patient model
   */
  interface PatientFieldRefs {
    readonly id: FieldRef<"Patient", 'String'>
    readonly patientName: FieldRef<"Patient", 'String'>
    readonly dateOfBirth: FieldRef<"Patient", 'DateTime'>
    readonly dateOfInjury: FieldRef<"Patient", 'DateTime'>
    readonly createdAt: FieldRef<"Patient", 'DateTime'>
    readonly updatedAt: FieldRef<"Patient", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Patient findUnique
   */
  export type PatientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient findUniqueOrThrow
   */
  export type PatientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient findFirst
   */
  export type PatientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Patients.
     */
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient findFirstOrThrow
   */
  export type PatientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Patients.
     */
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient findMany
   */
  export type PatientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patients to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient create
   */
  export type PatientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * The data needed to create a Patient.
     */
    data: XOR<PatientCreateInput, PatientUncheckedCreateInput>
  }

  /**
   * Patient createMany
   */
  export type PatientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Patients.
     */
    data: PatientCreateManyInput | PatientCreateManyInput[]
  }

  /**
   * Patient createManyAndReturn
   */
  export type PatientCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * The data used to create many Patients.
     */
    data: PatientCreateManyInput | PatientCreateManyInput[]
  }

  /**
   * Patient update
   */
  export type PatientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * The data needed to update a Patient.
     */
    data: XOR<PatientUpdateInput, PatientUncheckedUpdateInput>
    /**
     * Choose, which Patient to update.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient updateMany
   */
  export type PatientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Patients.
     */
    data: XOR<PatientUpdateManyMutationInput, PatientUncheckedUpdateManyInput>
    /**
     * Filter which Patients to update
     */
    where?: PatientWhereInput
    /**
     * Limit how many Patients to update.
     */
    limit?: number
  }

  /**
   * Patient updateManyAndReturn
   */
  export type PatientUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * The data used to update Patients.
     */
    data: XOR<PatientUpdateManyMutationInput, PatientUncheckedUpdateManyInput>
    /**
     * Filter which Patients to update
     */
    where?: PatientWhereInput
    /**
     * Limit how many Patients to update.
     */
    limit?: number
  }

  /**
   * Patient upsert
   */
  export type PatientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * The filter to search for the Patient to update in case it exists.
     */
    where: PatientWhereUniqueInput
    /**
     * In case the Patient found by the `where` argument doesn't exist, create a new Patient with this data.
     */
    create: XOR<PatientCreateInput, PatientUncheckedCreateInput>
    /**
     * In case the Patient was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatientUpdateInput, PatientUncheckedUpdateInput>
  }

  /**
   * Patient delete
   */
  export type PatientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter which Patient to delete.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient deleteMany
   */
  export type PatientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Patients to delete
     */
    where?: PatientWhereInput
    /**
     * Limit how many Patients to delete.
     */
    limit?: number
  }

  /**
   * Patient.providers
   */
  export type Patient$providersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientProvider
     */
    select?: PatientProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientProvider
     */
    omit?: PatientProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientProviderInclude<ExtArgs> | null
    where?: PatientProviderWhereInput
    orderBy?: PatientProviderOrderByWithRelationInput | PatientProviderOrderByWithRelationInput[]
    cursor?: PatientProviderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PatientProviderScalarFieldEnum | PatientProviderScalarFieldEnum[]
  }

  /**
   * Patient.affidavits
   */
  export type Patient$affidavitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Affidavit
     */
    select?: AffidavitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Affidavit
     */
    omit?: AffidavitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AffidavitInclude<ExtArgs> | null
    where?: AffidavitWhereInput
    orderBy?: AffidavitOrderByWithRelationInput | AffidavitOrderByWithRelationInput[]
    cursor?: AffidavitWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AffidavitScalarFieldEnum | AffidavitScalarFieldEnum[]
  }

  /**
   * Patient without action
   */
  export type PatientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
  }


  /**
   * Model Provider
   */

  export type AggregateProvider = {
    _count: ProviderCountAggregateOutputType | null
    _min: ProviderMinAggregateOutputType | null
    _max: ProviderMaxAggregateOutputType | null
  }

  export type ProviderMinAggregateOutputType = {
    id: string | null
    name: string | null
    address: string | null
    email: string | null
    phone: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProviderMaxAggregateOutputType = {
    id: string | null
    name: string | null
    address: string | null
    email: string | null
    phone: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProviderCountAggregateOutputType = {
    id: number
    name: number
    address: number
    email: number
    phone: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProviderMinAggregateInputType = {
    id?: true
    name?: true
    address?: true
    email?: true
    phone?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProviderMaxAggregateInputType = {
    id?: true
    name?: true
    address?: true
    email?: true
    phone?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProviderCountAggregateInputType = {
    id?: true
    name?: true
    address?: true
    email?: true
    phone?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProviderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Provider to aggregate.
     */
    where?: ProviderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Providers to fetch.
     */
    orderBy?: ProviderOrderByWithRelationInput | ProviderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProviderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Providers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Providers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Providers
    **/
    _count?: true | ProviderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProviderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProviderMaxAggregateInputType
  }

  export type GetProviderAggregateType<T extends ProviderAggregateArgs> = {
        [P in keyof T & keyof AggregateProvider]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProvider[P]>
      : GetScalarType<T[P], AggregateProvider[P]>
  }




  export type ProviderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProviderWhereInput
    orderBy?: ProviderOrderByWithAggregationInput | ProviderOrderByWithAggregationInput[]
    by: ProviderScalarFieldEnum[] | ProviderScalarFieldEnum
    having?: ProviderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProviderCountAggregateInputType | true
    _min?: ProviderMinAggregateInputType
    _max?: ProviderMaxAggregateInputType
  }

  export type ProviderGroupByOutputType = {
    id: string
    name: string
    address: string
    email: string
    phone: string
    createdAt: Date
    updatedAt: Date
    _count: ProviderCountAggregateOutputType | null
    _min: ProviderMinAggregateOutputType | null
    _max: ProviderMaxAggregateOutputType | null
  }

  type GetProviderGroupByPayload<T extends ProviderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProviderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProviderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProviderGroupByOutputType[P]>
            : GetScalarType<T[P], ProviderGroupByOutputType[P]>
        }
      >
    >


  export type ProviderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    email?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patients?: boolean | Provider$patientsArgs<ExtArgs>
    affidavits?: boolean | Provider$affidavitsArgs<ExtArgs>
    _count?: boolean | ProviderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["provider"]>

  export type ProviderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    email?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["provider"]>

  export type ProviderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    email?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["provider"]>

  export type ProviderSelectScalar = {
    id?: boolean
    name?: boolean
    address?: boolean
    email?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProviderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "address" | "email" | "phone" | "createdAt" | "updatedAt", ExtArgs["result"]["provider"]>
  export type ProviderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patients?: boolean | Provider$patientsArgs<ExtArgs>
    affidavits?: boolean | Provider$affidavitsArgs<ExtArgs>
    _count?: boolean | ProviderCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProviderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ProviderIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProviderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Provider"
    objects: {
      patients: Prisma.$PatientProviderPayload<ExtArgs>[]
      affidavits: Prisma.$AffidavitPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      address: string
      email: string
      phone: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["provider"]>
    composites: {}
  }

  type ProviderGetPayload<S extends boolean | null | undefined | ProviderDefaultArgs> = $Result.GetResult<Prisma.$ProviderPayload, S>

  type ProviderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProviderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProviderCountAggregateInputType | true
    }

  export interface ProviderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Provider'], meta: { name: 'Provider' } }
    /**
     * Find zero or one Provider that matches the filter.
     * @param {ProviderFindUniqueArgs} args - Arguments to find a Provider
     * @example
     * // Get one Provider
     * const provider = await prisma.provider.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProviderFindUniqueArgs>(args: SelectSubset<T, ProviderFindUniqueArgs<ExtArgs>>): Prisma__ProviderClient<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Provider that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProviderFindUniqueOrThrowArgs} args - Arguments to find a Provider
     * @example
     * // Get one Provider
     * const provider = await prisma.provider.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProviderFindUniqueOrThrowArgs>(args: SelectSubset<T, ProviderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProviderClient<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Provider that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderFindFirstArgs} args - Arguments to find a Provider
     * @example
     * // Get one Provider
     * const provider = await prisma.provider.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProviderFindFirstArgs>(args?: SelectSubset<T, ProviderFindFirstArgs<ExtArgs>>): Prisma__ProviderClient<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Provider that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderFindFirstOrThrowArgs} args - Arguments to find a Provider
     * @example
     * // Get one Provider
     * const provider = await prisma.provider.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProviderFindFirstOrThrowArgs>(args?: SelectSubset<T, ProviderFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProviderClient<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Providers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Providers
     * const providers = await prisma.provider.findMany()
     * 
     * // Get first 10 Providers
     * const providers = await prisma.provider.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const providerWithIdOnly = await prisma.provider.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProviderFindManyArgs>(args?: SelectSubset<T, ProviderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Provider.
     * @param {ProviderCreateArgs} args - Arguments to create a Provider.
     * @example
     * // Create one Provider
     * const Provider = await prisma.provider.create({
     *   data: {
     *     // ... data to create a Provider
     *   }
     * })
     * 
     */
    create<T extends ProviderCreateArgs>(args: SelectSubset<T, ProviderCreateArgs<ExtArgs>>): Prisma__ProviderClient<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Providers.
     * @param {ProviderCreateManyArgs} args - Arguments to create many Providers.
     * @example
     * // Create many Providers
     * const provider = await prisma.provider.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProviderCreateManyArgs>(args?: SelectSubset<T, ProviderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Providers and returns the data saved in the database.
     * @param {ProviderCreateManyAndReturnArgs} args - Arguments to create many Providers.
     * @example
     * // Create many Providers
     * const provider = await prisma.provider.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Providers and only return the `id`
     * const providerWithIdOnly = await prisma.provider.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProviderCreateManyAndReturnArgs>(args?: SelectSubset<T, ProviderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Provider.
     * @param {ProviderDeleteArgs} args - Arguments to delete one Provider.
     * @example
     * // Delete one Provider
     * const Provider = await prisma.provider.delete({
     *   where: {
     *     // ... filter to delete one Provider
     *   }
     * })
     * 
     */
    delete<T extends ProviderDeleteArgs>(args: SelectSubset<T, ProviderDeleteArgs<ExtArgs>>): Prisma__ProviderClient<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Provider.
     * @param {ProviderUpdateArgs} args - Arguments to update one Provider.
     * @example
     * // Update one Provider
     * const provider = await prisma.provider.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProviderUpdateArgs>(args: SelectSubset<T, ProviderUpdateArgs<ExtArgs>>): Prisma__ProviderClient<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Providers.
     * @param {ProviderDeleteManyArgs} args - Arguments to filter Providers to delete.
     * @example
     * // Delete a few Providers
     * const { count } = await prisma.provider.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProviderDeleteManyArgs>(args?: SelectSubset<T, ProviderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Providers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Providers
     * const provider = await prisma.provider.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProviderUpdateManyArgs>(args: SelectSubset<T, ProviderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Providers and returns the data updated in the database.
     * @param {ProviderUpdateManyAndReturnArgs} args - Arguments to update many Providers.
     * @example
     * // Update many Providers
     * const provider = await prisma.provider.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Providers and only return the `id`
     * const providerWithIdOnly = await prisma.provider.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProviderUpdateManyAndReturnArgs>(args: SelectSubset<T, ProviderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Provider.
     * @param {ProviderUpsertArgs} args - Arguments to update or create a Provider.
     * @example
     * // Update or create a Provider
     * const provider = await prisma.provider.upsert({
     *   create: {
     *     // ... data to create a Provider
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Provider we want to update
     *   }
     * })
     */
    upsert<T extends ProviderUpsertArgs>(args: SelectSubset<T, ProviderUpsertArgs<ExtArgs>>): Prisma__ProviderClient<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Providers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderCountArgs} args - Arguments to filter Providers to count.
     * @example
     * // Count the number of Providers
     * const count = await prisma.provider.count({
     *   where: {
     *     // ... the filter for the Providers we want to count
     *   }
     * })
    **/
    count<T extends ProviderCountArgs>(
      args?: Subset<T, ProviderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProviderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Provider.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProviderAggregateArgs>(args: Subset<T, ProviderAggregateArgs>): Prisma.PrismaPromise<GetProviderAggregateType<T>>

    /**
     * Group by Provider.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProviderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProviderGroupByArgs['orderBy'] }
        : { orderBy?: ProviderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProviderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProviderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Provider model
   */
  readonly fields: ProviderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Provider.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProviderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patients<T extends Provider$patientsArgs<ExtArgs> = {}>(args?: Subset<T, Provider$patientsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientProviderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    affidavits<T extends Provider$affidavitsArgs<ExtArgs> = {}>(args?: Subset<T, Provider$affidavitsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AffidavitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Provider model
   */
  interface ProviderFieldRefs {
    readonly id: FieldRef<"Provider", 'String'>
    readonly name: FieldRef<"Provider", 'String'>
    readonly address: FieldRef<"Provider", 'String'>
    readonly email: FieldRef<"Provider", 'String'>
    readonly phone: FieldRef<"Provider", 'String'>
    readonly createdAt: FieldRef<"Provider", 'DateTime'>
    readonly updatedAt: FieldRef<"Provider", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Provider findUnique
   */
  export type ProviderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Provider
     */
    select?: ProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Provider
     */
    omit?: ProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderInclude<ExtArgs> | null
    /**
     * Filter, which Provider to fetch.
     */
    where: ProviderWhereUniqueInput
  }

  /**
   * Provider findUniqueOrThrow
   */
  export type ProviderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Provider
     */
    select?: ProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Provider
     */
    omit?: ProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderInclude<ExtArgs> | null
    /**
     * Filter, which Provider to fetch.
     */
    where: ProviderWhereUniqueInput
  }

  /**
   * Provider findFirst
   */
  export type ProviderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Provider
     */
    select?: ProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Provider
     */
    omit?: ProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderInclude<ExtArgs> | null
    /**
     * Filter, which Provider to fetch.
     */
    where?: ProviderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Providers to fetch.
     */
    orderBy?: ProviderOrderByWithRelationInput | ProviderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Providers.
     */
    cursor?: ProviderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Providers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Providers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Providers.
     */
    distinct?: ProviderScalarFieldEnum | ProviderScalarFieldEnum[]
  }

  /**
   * Provider findFirstOrThrow
   */
  export type ProviderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Provider
     */
    select?: ProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Provider
     */
    omit?: ProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderInclude<ExtArgs> | null
    /**
     * Filter, which Provider to fetch.
     */
    where?: ProviderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Providers to fetch.
     */
    orderBy?: ProviderOrderByWithRelationInput | ProviderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Providers.
     */
    cursor?: ProviderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Providers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Providers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Providers.
     */
    distinct?: ProviderScalarFieldEnum | ProviderScalarFieldEnum[]
  }

  /**
   * Provider findMany
   */
  export type ProviderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Provider
     */
    select?: ProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Provider
     */
    omit?: ProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderInclude<ExtArgs> | null
    /**
     * Filter, which Providers to fetch.
     */
    where?: ProviderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Providers to fetch.
     */
    orderBy?: ProviderOrderByWithRelationInput | ProviderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Providers.
     */
    cursor?: ProviderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Providers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Providers.
     */
    skip?: number
    distinct?: ProviderScalarFieldEnum | ProviderScalarFieldEnum[]
  }

  /**
   * Provider create
   */
  export type ProviderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Provider
     */
    select?: ProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Provider
     */
    omit?: ProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderInclude<ExtArgs> | null
    /**
     * The data needed to create a Provider.
     */
    data: XOR<ProviderCreateInput, ProviderUncheckedCreateInput>
  }

  /**
   * Provider createMany
   */
  export type ProviderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Providers.
     */
    data: ProviderCreateManyInput | ProviderCreateManyInput[]
  }

  /**
   * Provider createManyAndReturn
   */
  export type ProviderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Provider
     */
    select?: ProviderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Provider
     */
    omit?: ProviderOmit<ExtArgs> | null
    /**
     * The data used to create many Providers.
     */
    data: ProviderCreateManyInput | ProviderCreateManyInput[]
  }

  /**
   * Provider update
   */
  export type ProviderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Provider
     */
    select?: ProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Provider
     */
    omit?: ProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderInclude<ExtArgs> | null
    /**
     * The data needed to update a Provider.
     */
    data: XOR<ProviderUpdateInput, ProviderUncheckedUpdateInput>
    /**
     * Choose, which Provider to update.
     */
    where: ProviderWhereUniqueInput
  }

  /**
   * Provider updateMany
   */
  export type ProviderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Providers.
     */
    data: XOR<ProviderUpdateManyMutationInput, ProviderUncheckedUpdateManyInput>
    /**
     * Filter which Providers to update
     */
    where?: ProviderWhereInput
    /**
     * Limit how many Providers to update.
     */
    limit?: number
  }

  /**
   * Provider updateManyAndReturn
   */
  export type ProviderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Provider
     */
    select?: ProviderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Provider
     */
    omit?: ProviderOmit<ExtArgs> | null
    /**
     * The data used to update Providers.
     */
    data: XOR<ProviderUpdateManyMutationInput, ProviderUncheckedUpdateManyInput>
    /**
     * Filter which Providers to update
     */
    where?: ProviderWhereInput
    /**
     * Limit how many Providers to update.
     */
    limit?: number
  }

  /**
   * Provider upsert
   */
  export type ProviderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Provider
     */
    select?: ProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Provider
     */
    omit?: ProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderInclude<ExtArgs> | null
    /**
     * The filter to search for the Provider to update in case it exists.
     */
    where: ProviderWhereUniqueInput
    /**
     * In case the Provider found by the `where` argument doesn't exist, create a new Provider with this data.
     */
    create: XOR<ProviderCreateInput, ProviderUncheckedCreateInput>
    /**
     * In case the Provider was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProviderUpdateInput, ProviderUncheckedUpdateInput>
  }

  /**
   * Provider delete
   */
  export type ProviderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Provider
     */
    select?: ProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Provider
     */
    omit?: ProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderInclude<ExtArgs> | null
    /**
     * Filter which Provider to delete.
     */
    where: ProviderWhereUniqueInput
  }

  /**
   * Provider deleteMany
   */
  export type ProviderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Providers to delete
     */
    where?: ProviderWhereInput
    /**
     * Limit how many Providers to delete.
     */
    limit?: number
  }

  /**
   * Provider.patients
   */
  export type Provider$patientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientProvider
     */
    select?: PatientProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientProvider
     */
    omit?: PatientProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientProviderInclude<ExtArgs> | null
    where?: PatientProviderWhereInput
    orderBy?: PatientProviderOrderByWithRelationInput | PatientProviderOrderByWithRelationInput[]
    cursor?: PatientProviderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PatientProviderScalarFieldEnum | PatientProviderScalarFieldEnum[]
  }

  /**
   * Provider.affidavits
   */
  export type Provider$affidavitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Affidavit
     */
    select?: AffidavitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Affidavit
     */
    omit?: AffidavitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AffidavitInclude<ExtArgs> | null
    where?: AffidavitWhereInput
    orderBy?: AffidavitOrderByWithRelationInput | AffidavitOrderByWithRelationInput[]
    cursor?: AffidavitWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AffidavitScalarFieldEnum | AffidavitScalarFieldEnum[]
  }

  /**
   * Provider without action
   */
  export type ProviderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Provider
     */
    select?: ProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Provider
     */
    omit?: ProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderInclude<ExtArgs> | null
  }


  /**
   * Model PatientProvider
   */

  export type AggregatePatientProvider = {
    _count: PatientProviderCountAggregateOutputType | null
    _min: PatientProviderMinAggregateOutputType | null
    _max: PatientProviderMaxAggregateOutputType | null
  }

  export type PatientProviderMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    providerId: string | null
    requestType: string | null
    dosStart: Date | null
    dosEnd: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PatientProviderMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    providerId: string | null
    requestType: string | null
    dosStart: Date | null
    dosEnd: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PatientProviderCountAggregateOutputType = {
    id: number
    patientId: number
    providerId: number
    requestType: number
    dosStart: number
    dosEnd: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PatientProviderMinAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    requestType?: true
    dosStart?: true
    dosEnd?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PatientProviderMaxAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    requestType?: true
    dosStart?: true
    dosEnd?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PatientProviderCountAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    requestType?: true
    dosStart?: true
    dosEnd?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PatientProviderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientProvider to aggregate.
     */
    where?: PatientProviderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientProviders to fetch.
     */
    orderBy?: PatientProviderOrderByWithRelationInput | PatientProviderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatientProviderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientProviders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientProviders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PatientProviders
    **/
    _count?: true | PatientProviderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientProviderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientProviderMaxAggregateInputType
  }

  export type GetPatientProviderAggregateType<T extends PatientProviderAggregateArgs> = {
        [P in keyof T & keyof AggregatePatientProvider]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatientProvider[P]>
      : GetScalarType<T[P], AggregatePatientProvider[P]>
  }




  export type PatientProviderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientProviderWhereInput
    orderBy?: PatientProviderOrderByWithAggregationInput | PatientProviderOrderByWithAggregationInput[]
    by: PatientProviderScalarFieldEnum[] | PatientProviderScalarFieldEnum
    having?: PatientProviderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientProviderCountAggregateInputType | true
    _min?: PatientProviderMinAggregateInputType
    _max?: PatientProviderMaxAggregateInputType
  }

  export type PatientProviderGroupByOutputType = {
    id: string
    patientId: string
    providerId: string
    requestType: string
    dosStart: Date
    dosEnd: Date | null
    createdAt: Date
    updatedAt: Date
    _count: PatientProviderCountAggregateOutputType | null
    _min: PatientProviderMinAggregateOutputType | null
    _max: PatientProviderMaxAggregateOutputType | null
  }

  type GetPatientProviderGroupByPayload<T extends PatientProviderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatientProviderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientProviderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientProviderGroupByOutputType[P]>
            : GetScalarType<T[P], PatientProviderGroupByOutputType[P]>
        }
      >
    >


  export type PatientProviderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    requestType?: boolean
    dosStart?: boolean
    dosEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    provider?: boolean | ProviderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patientProvider"]>

  export type PatientProviderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    requestType?: boolean
    dosStart?: boolean
    dosEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    provider?: boolean | ProviderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patientProvider"]>

  export type PatientProviderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    requestType?: boolean
    dosStart?: boolean
    dosEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    provider?: boolean | ProviderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patientProvider"]>

  export type PatientProviderSelectScalar = {
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    requestType?: boolean
    dosStart?: boolean
    dosEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PatientProviderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "patientId" | "providerId" | "requestType" | "dosStart" | "dosEnd" | "createdAt" | "updatedAt", ExtArgs["result"]["patientProvider"]>
  export type PatientProviderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    provider?: boolean | ProviderDefaultArgs<ExtArgs>
  }
  export type PatientProviderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    provider?: boolean | ProviderDefaultArgs<ExtArgs>
  }
  export type PatientProviderIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    provider?: boolean | ProviderDefaultArgs<ExtArgs>
  }

  export type $PatientProviderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PatientProvider"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
      provider: Prisma.$ProviderPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      providerId: string
      requestType: string
      dosStart: Date
      dosEnd: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["patientProvider"]>
    composites: {}
  }

  type PatientProviderGetPayload<S extends boolean | null | undefined | PatientProviderDefaultArgs> = $Result.GetResult<Prisma.$PatientProviderPayload, S>

  type PatientProviderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PatientProviderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PatientProviderCountAggregateInputType | true
    }

  export interface PatientProviderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PatientProvider'], meta: { name: 'PatientProvider' } }
    /**
     * Find zero or one PatientProvider that matches the filter.
     * @param {PatientProviderFindUniqueArgs} args - Arguments to find a PatientProvider
     * @example
     * // Get one PatientProvider
     * const patientProvider = await prisma.patientProvider.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientProviderFindUniqueArgs>(args: SelectSubset<T, PatientProviderFindUniqueArgs<ExtArgs>>): Prisma__PatientProviderClient<$Result.GetResult<Prisma.$PatientProviderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PatientProvider that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PatientProviderFindUniqueOrThrowArgs} args - Arguments to find a PatientProvider
     * @example
     * // Get one PatientProvider
     * const patientProvider = await prisma.patientProvider.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientProviderFindUniqueOrThrowArgs>(args: SelectSubset<T, PatientProviderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatientProviderClient<$Result.GetResult<Prisma.$PatientProviderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PatientProvider that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientProviderFindFirstArgs} args - Arguments to find a PatientProvider
     * @example
     * // Get one PatientProvider
     * const patientProvider = await prisma.patientProvider.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientProviderFindFirstArgs>(args?: SelectSubset<T, PatientProviderFindFirstArgs<ExtArgs>>): Prisma__PatientProviderClient<$Result.GetResult<Prisma.$PatientProviderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PatientProvider that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientProviderFindFirstOrThrowArgs} args - Arguments to find a PatientProvider
     * @example
     * // Get one PatientProvider
     * const patientProvider = await prisma.patientProvider.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientProviderFindFirstOrThrowArgs>(args?: SelectSubset<T, PatientProviderFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatientProviderClient<$Result.GetResult<Prisma.$PatientProviderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PatientProviders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientProviderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PatientProviders
     * const patientProviders = await prisma.patientProvider.findMany()
     * 
     * // Get first 10 PatientProviders
     * const patientProviders = await prisma.patientProvider.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientProviderWithIdOnly = await prisma.patientProvider.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatientProviderFindManyArgs>(args?: SelectSubset<T, PatientProviderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientProviderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PatientProvider.
     * @param {PatientProviderCreateArgs} args - Arguments to create a PatientProvider.
     * @example
     * // Create one PatientProvider
     * const PatientProvider = await prisma.patientProvider.create({
     *   data: {
     *     // ... data to create a PatientProvider
     *   }
     * })
     * 
     */
    create<T extends PatientProviderCreateArgs>(args: SelectSubset<T, PatientProviderCreateArgs<ExtArgs>>): Prisma__PatientProviderClient<$Result.GetResult<Prisma.$PatientProviderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PatientProviders.
     * @param {PatientProviderCreateManyArgs} args - Arguments to create many PatientProviders.
     * @example
     * // Create many PatientProviders
     * const patientProvider = await prisma.patientProvider.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatientProviderCreateManyArgs>(args?: SelectSubset<T, PatientProviderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PatientProviders and returns the data saved in the database.
     * @param {PatientProviderCreateManyAndReturnArgs} args - Arguments to create many PatientProviders.
     * @example
     * // Create many PatientProviders
     * const patientProvider = await prisma.patientProvider.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PatientProviders and only return the `id`
     * const patientProviderWithIdOnly = await prisma.patientProvider.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PatientProviderCreateManyAndReturnArgs>(args?: SelectSubset<T, PatientProviderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientProviderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PatientProvider.
     * @param {PatientProviderDeleteArgs} args - Arguments to delete one PatientProvider.
     * @example
     * // Delete one PatientProvider
     * const PatientProvider = await prisma.patientProvider.delete({
     *   where: {
     *     // ... filter to delete one PatientProvider
     *   }
     * })
     * 
     */
    delete<T extends PatientProviderDeleteArgs>(args: SelectSubset<T, PatientProviderDeleteArgs<ExtArgs>>): Prisma__PatientProviderClient<$Result.GetResult<Prisma.$PatientProviderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PatientProvider.
     * @param {PatientProviderUpdateArgs} args - Arguments to update one PatientProvider.
     * @example
     * // Update one PatientProvider
     * const patientProvider = await prisma.patientProvider.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatientProviderUpdateArgs>(args: SelectSubset<T, PatientProviderUpdateArgs<ExtArgs>>): Prisma__PatientProviderClient<$Result.GetResult<Prisma.$PatientProviderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PatientProviders.
     * @param {PatientProviderDeleteManyArgs} args - Arguments to filter PatientProviders to delete.
     * @example
     * // Delete a few PatientProviders
     * const { count } = await prisma.patientProvider.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatientProviderDeleteManyArgs>(args?: SelectSubset<T, PatientProviderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PatientProviders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientProviderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PatientProviders
     * const patientProvider = await prisma.patientProvider.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatientProviderUpdateManyArgs>(args: SelectSubset<T, PatientProviderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PatientProviders and returns the data updated in the database.
     * @param {PatientProviderUpdateManyAndReturnArgs} args - Arguments to update many PatientProviders.
     * @example
     * // Update many PatientProviders
     * const patientProvider = await prisma.patientProvider.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PatientProviders and only return the `id`
     * const patientProviderWithIdOnly = await prisma.patientProvider.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PatientProviderUpdateManyAndReturnArgs>(args: SelectSubset<T, PatientProviderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientProviderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PatientProvider.
     * @param {PatientProviderUpsertArgs} args - Arguments to update or create a PatientProvider.
     * @example
     * // Update or create a PatientProvider
     * const patientProvider = await prisma.patientProvider.upsert({
     *   create: {
     *     // ... data to create a PatientProvider
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PatientProvider we want to update
     *   }
     * })
     */
    upsert<T extends PatientProviderUpsertArgs>(args: SelectSubset<T, PatientProviderUpsertArgs<ExtArgs>>): Prisma__PatientProviderClient<$Result.GetResult<Prisma.$PatientProviderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PatientProviders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientProviderCountArgs} args - Arguments to filter PatientProviders to count.
     * @example
     * // Count the number of PatientProviders
     * const count = await prisma.patientProvider.count({
     *   where: {
     *     // ... the filter for the PatientProviders we want to count
     *   }
     * })
    **/
    count<T extends PatientProviderCountArgs>(
      args?: Subset<T, PatientProviderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientProviderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PatientProvider.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientProviderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PatientProviderAggregateArgs>(args: Subset<T, PatientProviderAggregateArgs>): Prisma.PrismaPromise<GetPatientProviderAggregateType<T>>

    /**
     * Group by PatientProvider.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientProviderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PatientProviderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientProviderGroupByArgs['orderBy'] }
        : { orderBy?: PatientProviderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PatientProviderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientProviderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PatientProvider model
   */
  readonly fields: PatientProviderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PatientProvider.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatientProviderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    provider<T extends ProviderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProviderDefaultArgs<ExtArgs>>): Prisma__ProviderClient<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PatientProvider model
   */
  interface PatientProviderFieldRefs {
    readonly id: FieldRef<"PatientProvider", 'String'>
    readonly patientId: FieldRef<"PatientProvider", 'String'>
    readonly providerId: FieldRef<"PatientProvider", 'String'>
    readonly requestType: FieldRef<"PatientProvider", 'String'>
    readonly dosStart: FieldRef<"PatientProvider", 'DateTime'>
    readonly dosEnd: FieldRef<"PatientProvider", 'DateTime'>
    readonly createdAt: FieldRef<"PatientProvider", 'DateTime'>
    readonly updatedAt: FieldRef<"PatientProvider", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PatientProvider findUnique
   */
  export type PatientProviderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientProvider
     */
    select?: PatientProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientProvider
     */
    omit?: PatientProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientProviderInclude<ExtArgs> | null
    /**
     * Filter, which PatientProvider to fetch.
     */
    where: PatientProviderWhereUniqueInput
  }

  /**
   * PatientProvider findUniqueOrThrow
   */
  export type PatientProviderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientProvider
     */
    select?: PatientProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientProvider
     */
    omit?: PatientProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientProviderInclude<ExtArgs> | null
    /**
     * Filter, which PatientProvider to fetch.
     */
    where: PatientProviderWhereUniqueInput
  }

  /**
   * PatientProvider findFirst
   */
  export type PatientProviderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientProvider
     */
    select?: PatientProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientProvider
     */
    omit?: PatientProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientProviderInclude<ExtArgs> | null
    /**
     * Filter, which PatientProvider to fetch.
     */
    where?: PatientProviderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientProviders to fetch.
     */
    orderBy?: PatientProviderOrderByWithRelationInput | PatientProviderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientProviders.
     */
    cursor?: PatientProviderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientProviders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientProviders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientProviders.
     */
    distinct?: PatientProviderScalarFieldEnum | PatientProviderScalarFieldEnum[]
  }

  /**
   * PatientProvider findFirstOrThrow
   */
  export type PatientProviderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientProvider
     */
    select?: PatientProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientProvider
     */
    omit?: PatientProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientProviderInclude<ExtArgs> | null
    /**
     * Filter, which PatientProvider to fetch.
     */
    where?: PatientProviderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientProviders to fetch.
     */
    orderBy?: PatientProviderOrderByWithRelationInput | PatientProviderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientProviders.
     */
    cursor?: PatientProviderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientProviders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientProviders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientProviders.
     */
    distinct?: PatientProviderScalarFieldEnum | PatientProviderScalarFieldEnum[]
  }

  /**
   * PatientProvider findMany
   */
  export type PatientProviderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientProvider
     */
    select?: PatientProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientProvider
     */
    omit?: PatientProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientProviderInclude<ExtArgs> | null
    /**
     * Filter, which PatientProviders to fetch.
     */
    where?: PatientProviderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientProviders to fetch.
     */
    orderBy?: PatientProviderOrderByWithRelationInput | PatientProviderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PatientProviders.
     */
    cursor?: PatientProviderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientProviders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientProviders.
     */
    skip?: number
    distinct?: PatientProviderScalarFieldEnum | PatientProviderScalarFieldEnum[]
  }

  /**
   * PatientProvider create
   */
  export type PatientProviderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientProvider
     */
    select?: PatientProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientProvider
     */
    omit?: PatientProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientProviderInclude<ExtArgs> | null
    /**
     * The data needed to create a PatientProvider.
     */
    data: XOR<PatientProviderCreateInput, PatientProviderUncheckedCreateInput>
  }

  /**
   * PatientProvider createMany
   */
  export type PatientProviderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PatientProviders.
     */
    data: PatientProviderCreateManyInput | PatientProviderCreateManyInput[]
  }

  /**
   * PatientProvider createManyAndReturn
   */
  export type PatientProviderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientProvider
     */
    select?: PatientProviderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PatientProvider
     */
    omit?: PatientProviderOmit<ExtArgs> | null
    /**
     * The data used to create many PatientProviders.
     */
    data: PatientProviderCreateManyInput | PatientProviderCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientProviderIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PatientProvider update
   */
  export type PatientProviderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientProvider
     */
    select?: PatientProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientProvider
     */
    omit?: PatientProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientProviderInclude<ExtArgs> | null
    /**
     * The data needed to update a PatientProvider.
     */
    data: XOR<PatientProviderUpdateInput, PatientProviderUncheckedUpdateInput>
    /**
     * Choose, which PatientProvider to update.
     */
    where: PatientProviderWhereUniqueInput
  }

  /**
   * PatientProvider updateMany
   */
  export type PatientProviderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PatientProviders.
     */
    data: XOR<PatientProviderUpdateManyMutationInput, PatientProviderUncheckedUpdateManyInput>
    /**
     * Filter which PatientProviders to update
     */
    where?: PatientProviderWhereInput
    /**
     * Limit how many PatientProviders to update.
     */
    limit?: number
  }

  /**
   * PatientProvider updateManyAndReturn
   */
  export type PatientProviderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientProvider
     */
    select?: PatientProviderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PatientProvider
     */
    omit?: PatientProviderOmit<ExtArgs> | null
    /**
     * The data used to update PatientProviders.
     */
    data: XOR<PatientProviderUpdateManyMutationInput, PatientProviderUncheckedUpdateManyInput>
    /**
     * Filter which PatientProviders to update
     */
    where?: PatientProviderWhereInput
    /**
     * Limit how many PatientProviders to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientProviderIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PatientProvider upsert
   */
  export type PatientProviderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientProvider
     */
    select?: PatientProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientProvider
     */
    omit?: PatientProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientProviderInclude<ExtArgs> | null
    /**
     * The filter to search for the PatientProvider to update in case it exists.
     */
    where: PatientProviderWhereUniqueInput
    /**
     * In case the PatientProvider found by the `where` argument doesn't exist, create a new PatientProvider with this data.
     */
    create: XOR<PatientProviderCreateInput, PatientProviderUncheckedCreateInput>
    /**
     * In case the PatientProvider was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatientProviderUpdateInput, PatientProviderUncheckedUpdateInput>
  }

  /**
   * PatientProvider delete
   */
  export type PatientProviderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientProvider
     */
    select?: PatientProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientProvider
     */
    omit?: PatientProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientProviderInclude<ExtArgs> | null
    /**
     * Filter which PatientProvider to delete.
     */
    where: PatientProviderWhereUniqueInput
  }

  /**
   * PatientProvider deleteMany
   */
  export type PatientProviderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientProviders to delete
     */
    where?: PatientProviderWhereInput
    /**
     * Limit how many PatientProviders to delete.
     */
    limit?: number
  }

  /**
   * PatientProvider without action
   */
  export type PatientProviderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientProvider
     */
    select?: PatientProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientProvider
     */
    omit?: PatientProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientProviderInclude<ExtArgs> | null
  }


  /**
   * Model AffidavitTemplate
   */

  export type AggregateAffidavitTemplate = {
    _count: AffidavitTemplateCountAggregateOutputType | null
    _avg: AffidavitTemplateAvgAggregateOutputType | null
    _sum: AffidavitTemplateSumAggregateOutputType | null
    _min: AffidavitTemplateMinAggregateOutputType | null
    _max: AffidavitTemplateMaxAggregateOutputType | null
  }

  export type AffidavitTemplateAvgAggregateOutputType = {
    version: number | null
  }

  export type AffidavitTemplateSumAggregateOutputType = {
    version: number | null
  }

  export type AffidavitTemplateMinAggregateOutputType = {
    id: string | null
    name: string | null
    filePath: string | null
    version: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AffidavitTemplateMaxAggregateOutputType = {
    id: string | null
    name: string | null
    filePath: string | null
    version: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AffidavitTemplateCountAggregateOutputType = {
    id: number
    name: number
    filePath: number
    structure: number
    version: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AffidavitTemplateAvgAggregateInputType = {
    version?: true
  }

  export type AffidavitTemplateSumAggregateInputType = {
    version?: true
  }

  export type AffidavitTemplateMinAggregateInputType = {
    id?: true
    name?: true
    filePath?: true
    version?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AffidavitTemplateMaxAggregateInputType = {
    id?: true
    name?: true
    filePath?: true
    version?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AffidavitTemplateCountAggregateInputType = {
    id?: true
    name?: true
    filePath?: true
    structure?: true
    version?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AffidavitTemplateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AffidavitTemplate to aggregate.
     */
    where?: AffidavitTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AffidavitTemplates to fetch.
     */
    orderBy?: AffidavitTemplateOrderByWithRelationInput | AffidavitTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AffidavitTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AffidavitTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AffidavitTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AffidavitTemplates
    **/
    _count?: true | AffidavitTemplateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AffidavitTemplateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AffidavitTemplateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AffidavitTemplateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AffidavitTemplateMaxAggregateInputType
  }

  export type GetAffidavitTemplateAggregateType<T extends AffidavitTemplateAggregateArgs> = {
        [P in keyof T & keyof AggregateAffidavitTemplate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAffidavitTemplate[P]>
      : GetScalarType<T[P], AggregateAffidavitTemplate[P]>
  }




  export type AffidavitTemplateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AffidavitTemplateWhereInput
    orderBy?: AffidavitTemplateOrderByWithAggregationInput | AffidavitTemplateOrderByWithAggregationInput[]
    by: AffidavitTemplateScalarFieldEnum[] | AffidavitTemplateScalarFieldEnum
    having?: AffidavitTemplateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AffidavitTemplateCountAggregateInputType | true
    _avg?: AffidavitTemplateAvgAggregateInputType
    _sum?: AffidavitTemplateSumAggregateInputType
    _min?: AffidavitTemplateMinAggregateInputType
    _max?: AffidavitTemplateMaxAggregateInputType
  }

  export type AffidavitTemplateGroupByOutputType = {
    id: string
    name: string
    filePath: string
    structure: JsonValue
    version: number
    createdAt: Date
    updatedAt: Date
    _count: AffidavitTemplateCountAggregateOutputType | null
    _avg: AffidavitTemplateAvgAggregateOutputType | null
    _sum: AffidavitTemplateSumAggregateOutputType | null
    _min: AffidavitTemplateMinAggregateOutputType | null
    _max: AffidavitTemplateMaxAggregateOutputType | null
  }

  type GetAffidavitTemplateGroupByPayload<T extends AffidavitTemplateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AffidavitTemplateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AffidavitTemplateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AffidavitTemplateGroupByOutputType[P]>
            : GetScalarType<T[P], AffidavitTemplateGroupByOutputType[P]>
        }
      >
    >


  export type AffidavitTemplateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    filePath?: boolean
    structure?: boolean
    version?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["affidavitTemplate"]>

  export type AffidavitTemplateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    filePath?: boolean
    structure?: boolean
    version?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["affidavitTemplate"]>

  export type AffidavitTemplateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    filePath?: boolean
    structure?: boolean
    version?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["affidavitTemplate"]>

  export type AffidavitTemplateSelectScalar = {
    id?: boolean
    name?: boolean
    filePath?: boolean
    structure?: boolean
    version?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AffidavitTemplateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "filePath" | "structure" | "version" | "createdAt" | "updatedAt", ExtArgs["result"]["affidavitTemplate"]>

  export type $AffidavitTemplatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AffidavitTemplate"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      filePath: string
      structure: Prisma.JsonValue
      version: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["affidavitTemplate"]>
    composites: {}
  }

  type AffidavitTemplateGetPayload<S extends boolean | null | undefined | AffidavitTemplateDefaultArgs> = $Result.GetResult<Prisma.$AffidavitTemplatePayload, S>

  type AffidavitTemplateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AffidavitTemplateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AffidavitTemplateCountAggregateInputType | true
    }

  export interface AffidavitTemplateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AffidavitTemplate'], meta: { name: 'AffidavitTemplate' } }
    /**
     * Find zero or one AffidavitTemplate that matches the filter.
     * @param {AffidavitTemplateFindUniqueArgs} args - Arguments to find a AffidavitTemplate
     * @example
     * // Get one AffidavitTemplate
     * const affidavitTemplate = await prisma.affidavitTemplate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AffidavitTemplateFindUniqueArgs>(args: SelectSubset<T, AffidavitTemplateFindUniqueArgs<ExtArgs>>): Prisma__AffidavitTemplateClient<$Result.GetResult<Prisma.$AffidavitTemplatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AffidavitTemplate that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AffidavitTemplateFindUniqueOrThrowArgs} args - Arguments to find a AffidavitTemplate
     * @example
     * // Get one AffidavitTemplate
     * const affidavitTemplate = await prisma.affidavitTemplate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AffidavitTemplateFindUniqueOrThrowArgs>(args: SelectSubset<T, AffidavitTemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AffidavitTemplateClient<$Result.GetResult<Prisma.$AffidavitTemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AffidavitTemplate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AffidavitTemplateFindFirstArgs} args - Arguments to find a AffidavitTemplate
     * @example
     * // Get one AffidavitTemplate
     * const affidavitTemplate = await prisma.affidavitTemplate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AffidavitTemplateFindFirstArgs>(args?: SelectSubset<T, AffidavitTemplateFindFirstArgs<ExtArgs>>): Prisma__AffidavitTemplateClient<$Result.GetResult<Prisma.$AffidavitTemplatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AffidavitTemplate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AffidavitTemplateFindFirstOrThrowArgs} args - Arguments to find a AffidavitTemplate
     * @example
     * // Get one AffidavitTemplate
     * const affidavitTemplate = await prisma.affidavitTemplate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AffidavitTemplateFindFirstOrThrowArgs>(args?: SelectSubset<T, AffidavitTemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma__AffidavitTemplateClient<$Result.GetResult<Prisma.$AffidavitTemplatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AffidavitTemplates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AffidavitTemplateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AffidavitTemplates
     * const affidavitTemplates = await prisma.affidavitTemplate.findMany()
     * 
     * // Get first 10 AffidavitTemplates
     * const affidavitTemplates = await prisma.affidavitTemplate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const affidavitTemplateWithIdOnly = await prisma.affidavitTemplate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AffidavitTemplateFindManyArgs>(args?: SelectSubset<T, AffidavitTemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AffidavitTemplatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AffidavitTemplate.
     * @param {AffidavitTemplateCreateArgs} args - Arguments to create a AffidavitTemplate.
     * @example
     * // Create one AffidavitTemplate
     * const AffidavitTemplate = await prisma.affidavitTemplate.create({
     *   data: {
     *     // ... data to create a AffidavitTemplate
     *   }
     * })
     * 
     */
    create<T extends AffidavitTemplateCreateArgs>(args: SelectSubset<T, AffidavitTemplateCreateArgs<ExtArgs>>): Prisma__AffidavitTemplateClient<$Result.GetResult<Prisma.$AffidavitTemplatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AffidavitTemplates.
     * @param {AffidavitTemplateCreateManyArgs} args - Arguments to create many AffidavitTemplates.
     * @example
     * // Create many AffidavitTemplates
     * const affidavitTemplate = await prisma.affidavitTemplate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AffidavitTemplateCreateManyArgs>(args?: SelectSubset<T, AffidavitTemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AffidavitTemplates and returns the data saved in the database.
     * @param {AffidavitTemplateCreateManyAndReturnArgs} args - Arguments to create many AffidavitTemplates.
     * @example
     * // Create many AffidavitTemplates
     * const affidavitTemplate = await prisma.affidavitTemplate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AffidavitTemplates and only return the `id`
     * const affidavitTemplateWithIdOnly = await prisma.affidavitTemplate.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AffidavitTemplateCreateManyAndReturnArgs>(args?: SelectSubset<T, AffidavitTemplateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AffidavitTemplatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AffidavitTemplate.
     * @param {AffidavitTemplateDeleteArgs} args - Arguments to delete one AffidavitTemplate.
     * @example
     * // Delete one AffidavitTemplate
     * const AffidavitTemplate = await prisma.affidavitTemplate.delete({
     *   where: {
     *     // ... filter to delete one AffidavitTemplate
     *   }
     * })
     * 
     */
    delete<T extends AffidavitTemplateDeleteArgs>(args: SelectSubset<T, AffidavitTemplateDeleteArgs<ExtArgs>>): Prisma__AffidavitTemplateClient<$Result.GetResult<Prisma.$AffidavitTemplatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AffidavitTemplate.
     * @param {AffidavitTemplateUpdateArgs} args - Arguments to update one AffidavitTemplate.
     * @example
     * // Update one AffidavitTemplate
     * const affidavitTemplate = await prisma.affidavitTemplate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AffidavitTemplateUpdateArgs>(args: SelectSubset<T, AffidavitTemplateUpdateArgs<ExtArgs>>): Prisma__AffidavitTemplateClient<$Result.GetResult<Prisma.$AffidavitTemplatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AffidavitTemplates.
     * @param {AffidavitTemplateDeleteManyArgs} args - Arguments to filter AffidavitTemplates to delete.
     * @example
     * // Delete a few AffidavitTemplates
     * const { count } = await prisma.affidavitTemplate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AffidavitTemplateDeleteManyArgs>(args?: SelectSubset<T, AffidavitTemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AffidavitTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AffidavitTemplateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AffidavitTemplates
     * const affidavitTemplate = await prisma.affidavitTemplate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AffidavitTemplateUpdateManyArgs>(args: SelectSubset<T, AffidavitTemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AffidavitTemplates and returns the data updated in the database.
     * @param {AffidavitTemplateUpdateManyAndReturnArgs} args - Arguments to update many AffidavitTemplates.
     * @example
     * // Update many AffidavitTemplates
     * const affidavitTemplate = await prisma.affidavitTemplate.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AffidavitTemplates and only return the `id`
     * const affidavitTemplateWithIdOnly = await prisma.affidavitTemplate.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AffidavitTemplateUpdateManyAndReturnArgs>(args: SelectSubset<T, AffidavitTemplateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AffidavitTemplatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AffidavitTemplate.
     * @param {AffidavitTemplateUpsertArgs} args - Arguments to update or create a AffidavitTemplate.
     * @example
     * // Update or create a AffidavitTemplate
     * const affidavitTemplate = await prisma.affidavitTemplate.upsert({
     *   create: {
     *     // ... data to create a AffidavitTemplate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AffidavitTemplate we want to update
     *   }
     * })
     */
    upsert<T extends AffidavitTemplateUpsertArgs>(args: SelectSubset<T, AffidavitTemplateUpsertArgs<ExtArgs>>): Prisma__AffidavitTemplateClient<$Result.GetResult<Prisma.$AffidavitTemplatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AffidavitTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AffidavitTemplateCountArgs} args - Arguments to filter AffidavitTemplates to count.
     * @example
     * // Count the number of AffidavitTemplates
     * const count = await prisma.affidavitTemplate.count({
     *   where: {
     *     // ... the filter for the AffidavitTemplates we want to count
     *   }
     * })
    **/
    count<T extends AffidavitTemplateCountArgs>(
      args?: Subset<T, AffidavitTemplateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AffidavitTemplateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AffidavitTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AffidavitTemplateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AffidavitTemplateAggregateArgs>(args: Subset<T, AffidavitTemplateAggregateArgs>): Prisma.PrismaPromise<GetAffidavitTemplateAggregateType<T>>

    /**
     * Group by AffidavitTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AffidavitTemplateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AffidavitTemplateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AffidavitTemplateGroupByArgs['orderBy'] }
        : { orderBy?: AffidavitTemplateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AffidavitTemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAffidavitTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AffidavitTemplate model
   */
  readonly fields: AffidavitTemplateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AffidavitTemplate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AffidavitTemplateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AffidavitTemplate model
   */
  interface AffidavitTemplateFieldRefs {
    readonly id: FieldRef<"AffidavitTemplate", 'String'>
    readonly name: FieldRef<"AffidavitTemplate", 'String'>
    readonly filePath: FieldRef<"AffidavitTemplate", 'String'>
    readonly structure: FieldRef<"AffidavitTemplate", 'Json'>
    readonly version: FieldRef<"AffidavitTemplate", 'Int'>
    readonly createdAt: FieldRef<"AffidavitTemplate", 'DateTime'>
    readonly updatedAt: FieldRef<"AffidavitTemplate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AffidavitTemplate findUnique
   */
  export type AffidavitTemplateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AffidavitTemplate
     */
    select?: AffidavitTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AffidavitTemplate
     */
    omit?: AffidavitTemplateOmit<ExtArgs> | null
    /**
     * Filter, which AffidavitTemplate to fetch.
     */
    where: AffidavitTemplateWhereUniqueInput
  }

  /**
   * AffidavitTemplate findUniqueOrThrow
   */
  export type AffidavitTemplateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AffidavitTemplate
     */
    select?: AffidavitTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AffidavitTemplate
     */
    omit?: AffidavitTemplateOmit<ExtArgs> | null
    /**
     * Filter, which AffidavitTemplate to fetch.
     */
    where: AffidavitTemplateWhereUniqueInput
  }

  /**
   * AffidavitTemplate findFirst
   */
  export type AffidavitTemplateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AffidavitTemplate
     */
    select?: AffidavitTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AffidavitTemplate
     */
    omit?: AffidavitTemplateOmit<ExtArgs> | null
    /**
     * Filter, which AffidavitTemplate to fetch.
     */
    where?: AffidavitTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AffidavitTemplates to fetch.
     */
    orderBy?: AffidavitTemplateOrderByWithRelationInput | AffidavitTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AffidavitTemplates.
     */
    cursor?: AffidavitTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AffidavitTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AffidavitTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AffidavitTemplates.
     */
    distinct?: AffidavitTemplateScalarFieldEnum | AffidavitTemplateScalarFieldEnum[]
  }

  /**
   * AffidavitTemplate findFirstOrThrow
   */
  export type AffidavitTemplateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AffidavitTemplate
     */
    select?: AffidavitTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AffidavitTemplate
     */
    omit?: AffidavitTemplateOmit<ExtArgs> | null
    /**
     * Filter, which AffidavitTemplate to fetch.
     */
    where?: AffidavitTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AffidavitTemplates to fetch.
     */
    orderBy?: AffidavitTemplateOrderByWithRelationInput | AffidavitTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AffidavitTemplates.
     */
    cursor?: AffidavitTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AffidavitTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AffidavitTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AffidavitTemplates.
     */
    distinct?: AffidavitTemplateScalarFieldEnum | AffidavitTemplateScalarFieldEnum[]
  }

  /**
   * AffidavitTemplate findMany
   */
  export type AffidavitTemplateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AffidavitTemplate
     */
    select?: AffidavitTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AffidavitTemplate
     */
    omit?: AffidavitTemplateOmit<ExtArgs> | null
    /**
     * Filter, which AffidavitTemplates to fetch.
     */
    where?: AffidavitTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AffidavitTemplates to fetch.
     */
    orderBy?: AffidavitTemplateOrderByWithRelationInput | AffidavitTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AffidavitTemplates.
     */
    cursor?: AffidavitTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AffidavitTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AffidavitTemplates.
     */
    skip?: number
    distinct?: AffidavitTemplateScalarFieldEnum | AffidavitTemplateScalarFieldEnum[]
  }

  /**
   * AffidavitTemplate create
   */
  export type AffidavitTemplateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AffidavitTemplate
     */
    select?: AffidavitTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AffidavitTemplate
     */
    omit?: AffidavitTemplateOmit<ExtArgs> | null
    /**
     * The data needed to create a AffidavitTemplate.
     */
    data: XOR<AffidavitTemplateCreateInput, AffidavitTemplateUncheckedCreateInput>
  }

  /**
   * AffidavitTemplate createMany
   */
  export type AffidavitTemplateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AffidavitTemplates.
     */
    data: AffidavitTemplateCreateManyInput | AffidavitTemplateCreateManyInput[]
  }

  /**
   * AffidavitTemplate createManyAndReturn
   */
  export type AffidavitTemplateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AffidavitTemplate
     */
    select?: AffidavitTemplateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AffidavitTemplate
     */
    omit?: AffidavitTemplateOmit<ExtArgs> | null
    /**
     * The data used to create many AffidavitTemplates.
     */
    data: AffidavitTemplateCreateManyInput | AffidavitTemplateCreateManyInput[]
  }

  /**
   * AffidavitTemplate update
   */
  export type AffidavitTemplateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AffidavitTemplate
     */
    select?: AffidavitTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AffidavitTemplate
     */
    omit?: AffidavitTemplateOmit<ExtArgs> | null
    /**
     * The data needed to update a AffidavitTemplate.
     */
    data: XOR<AffidavitTemplateUpdateInput, AffidavitTemplateUncheckedUpdateInput>
    /**
     * Choose, which AffidavitTemplate to update.
     */
    where: AffidavitTemplateWhereUniqueInput
  }

  /**
   * AffidavitTemplate updateMany
   */
  export type AffidavitTemplateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AffidavitTemplates.
     */
    data: XOR<AffidavitTemplateUpdateManyMutationInput, AffidavitTemplateUncheckedUpdateManyInput>
    /**
     * Filter which AffidavitTemplates to update
     */
    where?: AffidavitTemplateWhereInput
    /**
     * Limit how many AffidavitTemplates to update.
     */
    limit?: number
  }

  /**
   * AffidavitTemplate updateManyAndReturn
   */
  export type AffidavitTemplateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AffidavitTemplate
     */
    select?: AffidavitTemplateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AffidavitTemplate
     */
    omit?: AffidavitTemplateOmit<ExtArgs> | null
    /**
     * The data used to update AffidavitTemplates.
     */
    data: XOR<AffidavitTemplateUpdateManyMutationInput, AffidavitTemplateUncheckedUpdateManyInput>
    /**
     * Filter which AffidavitTemplates to update
     */
    where?: AffidavitTemplateWhereInput
    /**
     * Limit how many AffidavitTemplates to update.
     */
    limit?: number
  }

  /**
   * AffidavitTemplate upsert
   */
  export type AffidavitTemplateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AffidavitTemplate
     */
    select?: AffidavitTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AffidavitTemplate
     */
    omit?: AffidavitTemplateOmit<ExtArgs> | null
    /**
     * The filter to search for the AffidavitTemplate to update in case it exists.
     */
    where: AffidavitTemplateWhereUniqueInput
    /**
     * In case the AffidavitTemplate found by the `where` argument doesn't exist, create a new AffidavitTemplate with this data.
     */
    create: XOR<AffidavitTemplateCreateInput, AffidavitTemplateUncheckedCreateInput>
    /**
     * In case the AffidavitTemplate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AffidavitTemplateUpdateInput, AffidavitTemplateUncheckedUpdateInput>
  }

  /**
   * AffidavitTemplate delete
   */
  export type AffidavitTemplateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AffidavitTemplate
     */
    select?: AffidavitTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AffidavitTemplate
     */
    omit?: AffidavitTemplateOmit<ExtArgs> | null
    /**
     * Filter which AffidavitTemplate to delete.
     */
    where: AffidavitTemplateWhereUniqueInput
  }

  /**
   * AffidavitTemplate deleteMany
   */
  export type AffidavitTemplateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AffidavitTemplates to delete
     */
    where?: AffidavitTemplateWhereInput
    /**
     * Limit how many AffidavitTemplates to delete.
     */
    limit?: number
  }

  /**
   * AffidavitTemplate without action
   */
  export type AffidavitTemplateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AffidavitTemplate
     */
    select?: AffidavitTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AffidavitTemplate
     */
    omit?: AffidavitTemplateOmit<ExtArgs> | null
  }


  /**
   * Model Affidavit
   */

  export type AggregateAffidavit = {
    _count: AffidavitCountAggregateOutputType | null
    _min: AffidavitMinAggregateOutputType | null
    _max: AffidavitMaxAggregateOutputType | null
  }

  export type AffidavitMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    providerId: string | null
    content: string | null
    status: $Enums.AffidavitStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AffidavitMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    providerId: string | null
    content: string | null
    status: $Enums.AffidavitStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AffidavitCountAggregateOutputType = {
    id: number
    patientId: number
    providerId: number
    content: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AffidavitMinAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    content?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AffidavitMaxAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    content?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AffidavitCountAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    content?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AffidavitAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Affidavit to aggregate.
     */
    where?: AffidavitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Affidavits to fetch.
     */
    orderBy?: AffidavitOrderByWithRelationInput | AffidavitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AffidavitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Affidavits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Affidavits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Affidavits
    **/
    _count?: true | AffidavitCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AffidavitMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AffidavitMaxAggregateInputType
  }

  export type GetAffidavitAggregateType<T extends AffidavitAggregateArgs> = {
        [P in keyof T & keyof AggregateAffidavit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAffidavit[P]>
      : GetScalarType<T[P], AggregateAffidavit[P]>
  }




  export type AffidavitGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AffidavitWhereInput
    orderBy?: AffidavitOrderByWithAggregationInput | AffidavitOrderByWithAggregationInput[]
    by: AffidavitScalarFieldEnum[] | AffidavitScalarFieldEnum
    having?: AffidavitScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AffidavitCountAggregateInputType | true
    _min?: AffidavitMinAggregateInputType
    _max?: AffidavitMaxAggregateInputType
  }

  export type AffidavitGroupByOutputType = {
    id: string
    patientId: string
    providerId: string
    content: string
    status: $Enums.AffidavitStatus
    createdAt: Date
    updatedAt: Date
    _count: AffidavitCountAggregateOutputType | null
    _min: AffidavitMinAggregateOutputType | null
    _max: AffidavitMaxAggregateOutputType | null
  }

  type GetAffidavitGroupByPayload<T extends AffidavitGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AffidavitGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AffidavitGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AffidavitGroupByOutputType[P]>
            : GetScalarType<T[P], AffidavitGroupByOutputType[P]>
        }
      >
    >


  export type AffidavitSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    content?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    provider?: boolean | ProviderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["affidavit"]>

  export type AffidavitSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    content?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    provider?: boolean | ProviderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["affidavit"]>

  export type AffidavitSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    content?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    provider?: boolean | ProviderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["affidavit"]>

  export type AffidavitSelectScalar = {
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    content?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AffidavitOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "patientId" | "providerId" | "content" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["affidavit"]>
  export type AffidavitInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    provider?: boolean | ProviderDefaultArgs<ExtArgs>
  }
  export type AffidavitIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    provider?: boolean | ProviderDefaultArgs<ExtArgs>
  }
  export type AffidavitIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    provider?: boolean | ProviderDefaultArgs<ExtArgs>
  }

  export type $AffidavitPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Affidavit"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
      provider: Prisma.$ProviderPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      providerId: string
      content: string
      status: $Enums.AffidavitStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["affidavit"]>
    composites: {}
  }

  type AffidavitGetPayload<S extends boolean | null | undefined | AffidavitDefaultArgs> = $Result.GetResult<Prisma.$AffidavitPayload, S>

  type AffidavitCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AffidavitFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AffidavitCountAggregateInputType | true
    }

  export interface AffidavitDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Affidavit'], meta: { name: 'Affidavit' } }
    /**
     * Find zero or one Affidavit that matches the filter.
     * @param {AffidavitFindUniqueArgs} args - Arguments to find a Affidavit
     * @example
     * // Get one Affidavit
     * const affidavit = await prisma.affidavit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AffidavitFindUniqueArgs>(args: SelectSubset<T, AffidavitFindUniqueArgs<ExtArgs>>): Prisma__AffidavitClient<$Result.GetResult<Prisma.$AffidavitPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Affidavit that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AffidavitFindUniqueOrThrowArgs} args - Arguments to find a Affidavit
     * @example
     * // Get one Affidavit
     * const affidavit = await prisma.affidavit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AffidavitFindUniqueOrThrowArgs>(args: SelectSubset<T, AffidavitFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AffidavitClient<$Result.GetResult<Prisma.$AffidavitPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Affidavit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AffidavitFindFirstArgs} args - Arguments to find a Affidavit
     * @example
     * // Get one Affidavit
     * const affidavit = await prisma.affidavit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AffidavitFindFirstArgs>(args?: SelectSubset<T, AffidavitFindFirstArgs<ExtArgs>>): Prisma__AffidavitClient<$Result.GetResult<Prisma.$AffidavitPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Affidavit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AffidavitFindFirstOrThrowArgs} args - Arguments to find a Affidavit
     * @example
     * // Get one Affidavit
     * const affidavit = await prisma.affidavit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AffidavitFindFirstOrThrowArgs>(args?: SelectSubset<T, AffidavitFindFirstOrThrowArgs<ExtArgs>>): Prisma__AffidavitClient<$Result.GetResult<Prisma.$AffidavitPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Affidavits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AffidavitFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Affidavits
     * const affidavits = await prisma.affidavit.findMany()
     * 
     * // Get first 10 Affidavits
     * const affidavits = await prisma.affidavit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const affidavitWithIdOnly = await prisma.affidavit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AffidavitFindManyArgs>(args?: SelectSubset<T, AffidavitFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AffidavitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Affidavit.
     * @param {AffidavitCreateArgs} args - Arguments to create a Affidavit.
     * @example
     * // Create one Affidavit
     * const Affidavit = await prisma.affidavit.create({
     *   data: {
     *     // ... data to create a Affidavit
     *   }
     * })
     * 
     */
    create<T extends AffidavitCreateArgs>(args: SelectSubset<T, AffidavitCreateArgs<ExtArgs>>): Prisma__AffidavitClient<$Result.GetResult<Prisma.$AffidavitPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Affidavits.
     * @param {AffidavitCreateManyArgs} args - Arguments to create many Affidavits.
     * @example
     * // Create many Affidavits
     * const affidavit = await prisma.affidavit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AffidavitCreateManyArgs>(args?: SelectSubset<T, AffidavitCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Affidavits and returns the data saved in the database.
     * @param {AffidavitCreateManyAndReturnArgs} args - Arguments to create many Affidavits.
     * @example
     * // Create many Affidavits
     * const affidavit = await prisma.affidavit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Affidavits and only return the `id`
     * const affidavitWithIdOnly = await prisma.affidavit.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AffidavitCreateManyAndReturnArgs>(args?: SelectSubset<T, AffidavitCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AffidavitPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Affidavit.
     * @param {AffidavitDeleteArgs} args - Arguments to delete one Affidavit.
     * @example
     * // Delete one Affidavit
     * const Affidavit = await prisma.affidavit.delete({
     *   where: {
     *     // ... filter to delete one Affidavit
     *   }
     * })
     * 
     */
    delete<T extends AffidavitDeleteArgs>(args: SelectSubset<T, AffidavitDeleteArgs<ExtArgs>>): Prisma__AffidavitClient<$Result.GetResult<Prisma.$AffidavitPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Affidavit.
     * @param {AffidavitUpdateArgs} args - Arguments to update one Affidavit.
     * @example
     * // Update one Affidavit
     * const affidavit = await prisma.affidavit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AffidavitUpdateArgs>(args: SelectSubset<T, AffidavitUpdateArgs<ExtArgs>>): Prisma__AffidavitClient<$Result.GetResult<Prisma.$AffidavitPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Affidavits.
     * @param {AffidavitDeleteManyArgs} args - Arguments to filter Affidavits to delete.
     * @example
     * // Delete a few Affidavits
     * const { count } = await prisma.affidavit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AffidavitDeleteManyArgs>(args?: SelectSubset<T, AffidavitDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Affidavits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AffidavitUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Affidavits
     * const affidavit = await prisma.affidavit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AffidavitUpdateManyArgs>(args: SelectSubset<T, AffidavitUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Affidavits and returns the data updated in the database.
     * @param {AffidavitUpdateManyAndReturnArgs} args - Arguments to update many Affidavits.
     * @example
     * // Update many Affidavits
     * const affidavit = await prisma.affidavit.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Affidavits and only return the `id`
     * const affidavitWithIdOnly = await prisma.affidavit.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AffidavitUpdateManyAndReturnArgs>(args: SelectSubset<T, AffidavitUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AffidavitPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Affidavit.
     * @param {AffidavitUpsertArgs} args - Arguments to update or create a Affidavit.
     * @example
     * // Update or create a Affidavit
     * const affidavit = await prisma.affidavit.upsert({
     *   create: {
     *     // ... data to create a Affidavit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Affidavit we want to update
     *   }
     * })
     */
    upsert<T extends AffidavitUpsertArgs>(args: SelectSubset<T, AffidavitUpsertArgs<ExtArgs>>): Prisma__AffidavitClient<$Result.GetResult<Prisma.$AffidavitPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Affidavits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AffidavitCountArgs} args - Arguments to filter Affidavits to count.
     * @example
     * // Count the number of Affidavits
     * const count = await prisma.affidavit.count({
     *   where: {
     *     // ... the filter for the Affidavits we want to count
     *   }
     * })
    **/
    count<T extends AffidavitCountArgs>(
      args?: Subset<T, AffidavitCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AffidavitCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Affidavit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AffidavitAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AffidavitAggregateArgs>(args: Subset<T, AffidavitAggregateArgs>): Prisma.PrismaPromise<GetAffidavitAggregateType<T>>

    /**
     * Group by Affidavit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AffidavitGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AffidavitGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AffidavitGroupByArgs['orderBy'] }
        : { orderBy?: AffidavitGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AffidavitGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAffidavitGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Affidavit model
   */
  readonly fields: AffidavitFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Affidavit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AffidavitClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    provider<T extends ProviderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProviderDefaultArgs<ExtArgs>>): Prisma__ProviderClient<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Affidavit model
   */
  interface AffidavitFieldRefs {
    readonly id: FieldRef<"Affidavit", 'String'>
    readonly patientId: FieldRef<"Affidavit", 'String'>
    readonly providerId: FieldRef<"Affidavit", 'String'>
    readonly content: FieldRef<"Affidavit", 'String'>
    readonly status: FieldRef<"Affidavit", 'AffidavitStatus'>
    readonly createdAt: FieldRef<"Affidavit", 'DateTime'>
    readonly updatedAt: FieldRef<"Affidavit", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Affidavit findUnique
   */
  export type AffidavitFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Affidavit
     */
    select?: AffidavitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Affidavit
     */
    omit?: AffidavitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AffidavitInclude<ExtArgs> | null
    /**
     * Filter, which Affidavit to fetch.
     */
    where: AffidavitWhereUniqueInput
  }

  /**
   * Affidavit findUniqueOrThrow
   */
  export type AffidavitFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Affidavit
     */
    select?: AffidavitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Affidavit
     */
    omit?: AffidavitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AffidavitInclude<ExtArgs> | null
    /**
     * Filter, which Affidavit to fetch.
     */
    where: AffidavitWhereUniqueInput
  }

  /**
   * Affidavit findFirst
   */
  export type AffidavitFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Affidavit
     */
    select?: AffidavitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Affidavit
     */
    omit?: AffidavitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AffidavitInclude<ExtArgs> | null
    /**
     * Filter, which Affidavit to fetch.
     */
    where?: AffidavitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Affidavits to fetch.
     */
    orderBy?: AffidavitOrderByWithRelationInput | AffidavitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Affidavits.
     */
    cursor?: AffidavitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Affidavits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Affidavits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Affidavits.
     */
    distinct?: AffidavitScalarFieldEnum | AffidavitScalarFieldEnum[]
  }

  /**
   * Affidavit findFirstOrThrow
   */
  export type AffidavitFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Affidavit
     */
    select?: AffidavitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Affidavit
     */
    omit?: AffidavitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AffidavitInclude<ExtArgs> | null
    /**
     * Filter, which Affidavit to fetch.
     */
    where?: AffidavitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Affidavits to fetch.
     */
    orderBy?: AffidavitOrderByWithRelationInput | AffidavitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Affidavits.
     */
    cursor?: AffidavitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Affidavits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Affidavits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Affidavits.
     */
    distinct?: AffidavitScalarFieldEnum | AffidavitScalarFieldEnum[]
  }

  /**
   * Affidavit findMany
   */
  export type AffidavitFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Affidavit
     */
    select?: AffidavitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Affidavit
     */
    omit?: AffidavitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AffidavitInclude<ExtArgs> | null
    /**
     * Filter, which Affidavits to fetch.
     */
    where?: AffidavitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Affidavits to fetch.
     */
    orderBy?: AffidavitOrderByWithRelationInput | AffidavitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Affidavits.
     */
    cursor?: AffidavitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Affidavits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Affidavits.
     */
    skip?: number
    distinct?: AffidavitScalarFieldEnum | AffidavitScalarFieldEnum[]
  }

  /**
   * Affidavit create
   */
  export type AffidavitCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Affidavit
     */
    select?: AffidavitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Affidavit
     */
    omit?: AffidavitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AffidavitInclude<ExtArgs> | null
    /**
     * The data needed to create a Affidavit.
     */
    data: XOR<AffidavitCreateInput, AffidavitUncheckedCreateInput>
  }

  /**
   * Affidavit createMany
   */
  export type AffidavitCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Affidavits.
     */
    data: AffidavitCreateManyInput | AffidavitCreateManyInput[]
  }

  /**
   * Affidavit createManyAndReturn
   */
  export type AffidavitCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Affidavit
     */
    select?: AffidavitSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Affidavit
     */
    omit?: AffidavitOmit<ExtArgs> | null
    /**
     * The data used to create many Affidavits.
     */
    data: AffidavitCreateManyInput | AffidavitCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AffidavitIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Affidavit update
   */
  export type AffidavitUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Affidavit
     */
    select?: AffidavitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Affidavit
     */
    omit?: AffidavitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AffidavitInclude<ExtArgs> | null
    /**
     * The data needed to update a Affidavit.
     */
    data: XOR<AffidavitUpdateInput, AffidavitUncheckedUpdateInput>
    /**
     * Choose, which Affidavit to update.
     */
    where: AffidavitWhereUniqueInput
  }

  /**
   * Affidavit updateMany
   */
  export type AffidavitUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Affidavits.
     */
    data: XOR<AffidavitUpdateManyMutationInput, AffidavitUncheckedUpdateManyInput>
    /**
     * Filter which Affidavits to update
     */
    where?: AffidavitWhereInput
    /**
     * Limit how many Affidavits to update.
     */
    limit?: number
  }

  /**
   * Affidavit updateManyAndReturn
   */
  export type AffidavitUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Affidavit
     */
    select?: AffidavitSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Affidavit
     */
    omit?: AffidavitOmit<ExtArgs> | null
    /**
     * The data used to update Affidavits.
     */
    data: XOR<AffidavitUpdateManyMutationInput, AffidavitUncheckedUpdateManyInput>
    /**
     * Filter which Affidavits to update
     */
    where?: AffidavitWhereInput
    /**
     * Limit how many Affidavits to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AffidavitIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Affidavit upsert
   */
  export type AffidavitUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Affidavit
     */
    select?: AffidavitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Affidavit
     */
    omit?: AffidavitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AffidavitInclude<ExtArgs> | null
    /**
     * The filter to search for the Affidavit to update in case it exists.
     */
    where: AffidavitWhereUniqueInput
    /**
     * In case the Affidavit found by the `where` argument doesn't exist, create a new Affidavit with this data.
     */
    create: XOR<AffidavitCreateInput, AffidavitUncheckedCreateInput>
    /**
     * In case the Affidavit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AffidavitUpdateInput, AffidavitUncheckedUpdateInput>
  }

  /**
   * Affidavit delete
   */
  export type AffidavitDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Affidavit
     */
    select?: AffidavitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Affidavit
     */
    omit?: AffidavitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AffidavitInclude<ExtArgs> | null
    /**
     * Filter which Affidavit to delete.
     */
    where: AffidavitWhereUniqueInput
  }

  /**
   * Affidavit deleteMany
   */
  export type AffidavitDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Affidavits to delete
     */
    where?: AffidavitWhereInput
    /**
     * Limit how many Affidavits to delete.
     */
    limit?: number
  }

  /**
   * Affidavit without action
   */
  export type AffidavitDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Affidavit
     */
    select?: AffidavitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Affidavit
     */
    omit?: AffidavitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AffidavitInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const PatientScalarFieldEnum: {
    id: 'id',
    patientName: 'patientName',
    dateOfBirth: 'dateOfBirth',
    dateOfInjury: 'dateOfInjury',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PatientScalarFieldEnum = (typeof PatientScalarFieldEnum)[keyof typeof PatientScalarFieldEnum]


  export const ProviderScalarFieldEnum: {
    id: 'id',
    name: 'name',
    address: 'address',
    email: 'email',
    phone: 'phone',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProviderScalarFieldEnum = (typeof ProviderScalarFieldEnum)[keyof typeof ProviderScalarFieldEnum]


  export const PatientProviderScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    providerId: 'providerId',
    requestType: 'requestType',
    dosStart: 'dosStart',
    dosEnd: 'dosEnd',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PatientProviderScalarFieldEnum = (typeof PatientProviderScalarFieldEnum)[keyof typeof PatientProviderScalarFieldEnum]


  export const AffidavitTemplateScalarFieldEnum: {
    id: 'id',
    name: 'name',
    filePath: 'filePath',
    structure: 'structure',
    version: 'version',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AffidavitTemplateScalarFieldEnum = (typeof AffidavitTemplateScalarFieldEnum)[keyof typeof AffidavitTemplateScalarFieldEnum]


  export const AffidavitScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    providerId: 'providerId',
    content: 'content',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AffidavitScalarFieldEnum = (typeof AffidavitScalarFieldEnum)[keyof typeof AffidavitScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'AffidavitStatus'
   */
  export type EnumAffidavitStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AffidavitStatus'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type PatientWhereInput = {
    AND?: PatientWhereInput | PatientWhereInput[]
    OR?: PatientWhereInput[]
    NOT?: PatientWhereInput | PatientWhereInput[]
    id?: StringFilter<"Patient"> | string
    patientName?: StringFilter<"Patient"> | string
    dateOfBirth?: DateTimeFilter<"Patient"> | Date | string
    dateOfInjury?: DateTimeFilter<"Patient"> | Date | string
    createdAt?: DateTimeFilter<"Patient"> | Date | string
    updatedAt?: DateTimeFilter<"Patient"> | Date | string
    providers?: PatientProviderListRelationFilter
    affidavits?: AffidavitListRelationFilter
  }

  export type PatientOrderByWithRelationInput = {
    id?: SortOrder
    patientName?: SortOrder
    dateOfBirth?: SortOrder
    dateOfInjury?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    providers?: PatientProviderOrderByRelationAggregateInput
    affidavits?: AffidavitOrderByRelationAggregateInput
  }

  export type PatientWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PatientWhereInput | PatientWhereInput[]
    OR?: PatientWhereInput[]
    NOT?: PatientWhereInput | PatientWhereInput[]
    patientName?: StringFilter<"Patient"> | string
    dateOfBirth?: DateTimeFilter<"Patient"> | Date | string
    dateOfInjury?: DateTimeFilter<"Patient"> | Date | string
    createdAt?: DateTimeFilter<"Patient"> | Date | string
    updatedAt?: DateTimeFilter<"Patient"> | Date | string
    providers?: PatientProviderListRelationFilter
    affidavits?: AffidavitListRelationFilter
  }, "id">

  export type PatientOrderByWithAggregationInput = {
    id?: SortOrder
    patientName?: SortOrder
    dateOfBirth?: SortOrder
    dateOfInjury?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PatientCountOrderByAggregateInput
    _max?: PatientMaxOrderByAggregateInput
    _min?: PatientMinOrderByAggregateInput
  }

  export type PatientScalarWhereWithAggregatesInput = {
    AND?: PatientScalarWhereWithAggregatesInput | PatientScalarWhereWithAggregatesInput[]
    OR?: PatientScalarWhereWithAggregatesInput[]
    NOT?: PatientScalarWhereWithAggregatesInput | PatientScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Patient"> | string
    patientName?: StringWithAggregatesFilter<"Patient"> | string
    dateOfBirth?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
    dateOfInjury?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
  }

  export type ProviderWhereInput = {
    AND?: ProviderWhereInput | ProviderWhereInput[]
    OR?: ProviderWhereInput[]
    NOT?: ProviderWhereInput | ProviderWhereInput[]
    id?: StringFilter<"Provider"> | string
    name?: StringFilter<"Provider"> | string
    address?: StringFilter<"Provider"> | string
    email?: StringFilter<"Provider"> | string
    phone?: StringFilter<"Provider"> | string
    createdAt?: DateTimeFilter<"Provider"> | Date | string
    updatedAt?: DateTimeFilter<"Provider"> | Date | string
    patients?: PatientProviderListRelationFilter
    affidavits?: AffidavitListRelationFilter
  }

  export type ProviderOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    patients?: PatientProviderOrderByRelationAggregateInput
    affidavits?: AffidavitOrderByRelationAggregateInput
  }

  export type ProviderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProviderWhereInput | ProviderWhereInput[]
    OR?: ProviderWhereInput[]
    NOT?: ProviderWhereInput | ProviderWhereInput[]
    name?: StringFilter<"Provider"> | string
    address?: StringFilter<"Provider"> | string
    email?: StringFilter<"Provider"> | string
    phone?: StringFilter<"Provider"> | string
    createdAt?: DateTimeFilter<"Provider"> | Date | string
    updatedAt?: DateTimeFilter<"Provider"> | Date | string
    patients?: PatientProviderListRelationFilter
    affidavits?: AffidavitListRelationFilter
  }, "id">

  export type ProviderOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProviderCountOrderByAggregateInput
    _max?: ProviderMaxOrderByAggregateInput
    _min?: ProviderMinOrderByAggregateInput
  }

  export type ProviderScalarWhereWithAggregatesInput = {
    AND?: ProviderScalarWhereWithAggregatesInput | ProviderScalarWhereWithAggregatesInput[]
    OR?: ProviderScalarWhereWithAggregatesInput[]
    NOT?: ProviderScalarWhereWithAggregatesInput | ProviderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Provider"> | string
    name?: StringWithAggregatesFilter<"Provider"> | string
    address?: StringWithAggregatesFilter<"Provider"> | string
    email?: StringWithAggregatesFilter<"Provider"> | string
    phone?: StringWithAggregatesFilter<"Provider"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Provider"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Provider"> | Date | string
  }

  export type PatientProviderWhereInput = {
    AND?: PatientProviderWhereInput | PatientProviderWhereInput[]
    OR?: PatientProviderWhereInput[]
    NOT?: PatientProviderWhereInput | PatientProviderWhereInput[]
    id?: StringFilter<"PatientProvider"> | string
    patientId?: StringFilter<"PatientProvider"> | string
    providerId?: StringFilter<"PatientProvider"> | string
    requestType?: StringFilter<"PatientProvider"> | string
    dosStart?: DateTimeFilter<"PatientProvider"> | Date | string
    dosEnd?: DateTimeNullableFilter<"PatientProvider"> | Date | string | null
    createdAt?: DateTimeFilter<"PatientProvider"> | Date | string
    updatedAt?: DateTimeFilter<"PatientProvider"> | Date | string
    patient?: XOR<PatientScalarRelationFilter, PatientWhereInput>
    provider?: XOR<ProviderScalarRelationFilter, ProviderWhereInput>
  }

  export type PatientProviderOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    requestType?: SortOrder
    dosStart?: SortOrder
    dosEnd?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    patient?: PatientOrderByWithRelationInput
    provider?: ProviderOrderByWithRelationInput
  }

  export type PatientProviderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PatientProviderWhereInput | PatientProviderWhereInput[]
    OR?: PatientProviderWhereInput[]
    NOT?: PatientProviderWhereInput | PatientProviderWhereInput[]
    patientId?: StringFilter<"PatientProvider"> | string
    providerId?: StringFilter<"PatientProvider"> | string
    requestType?: StringFilter<"PatientProvider"> | string
    dosStart?: DateTimeFilter<"PatientProvider"> | Date | string
    dosEnd?: DateTimeNullableFilter<"PatientProvider"> | Date | string | null
    createdAt?: DateTimeFilter<"PatientProvider"> | Date | string
    updatedAt?: DateTimeFilter<"PatientProvider"> | Date | string
    patient?: XOR<PatientScalarRelationFilter, PatientWhereInput>
    provider?: XOR<ProviderScalarRelationFilter, ProviderWhereInput>
  }, "id">

  export type PatientProviderOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    requestType?: SortOrder
    dosStart?: SortOrder
    dosEnd?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PatientProviderCountOrderByAggregateInput
    _max?: PatientProviderMaxOrderByAggregateInput
    _min?: PatientProviderMinOrderByAggregateInput
  }

  export type PatientProviderScalarWhereWithAggregatesInput = {
    AND?: PatientProviderScalarWhereWithAggregatesInput | PatientProviderScalarWhereWithAggregatesInput[]
    OR?: PatientProviderScalarWhereWithAggregatesInput[]
    NOT?: PatientProviderScalarWhereWithAggregatesInput | PatientProviderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PatientProvider"> | string
    patientId?: StringWithAggregatesFilter<"PatientProvider"> | string
    providerId?: StringWithAggregatesFilter<"PatientProvider"> | string
    requestType?: StringWithAggregatesFilter<"PatientProvider"> | string
    dosStart?: DateTimeWithAggregatesFilter<"PatientProvider"> | Date | string
    dosEnd?: DateTimeNullableWithAggregatesFilter<"PatientProvider"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PatientProvider"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PatientProvider"> | Date | string
  }

  export type AffidavitTemplateWhereInput = {
    AND?: AffidavitTemplateWhereInput | AffidavitTemplateWhereInput[]
    OR?: AffidavitTemplateWhereInput[]
    NOT?: AffidavitTemplateWhereInput | AffidavitTemplateWhereInput[]
    id?: StringFilter<"AffidavitTemplate"> | string
    name?: StringFilter<"AffidavitTemplate"> | string
    filePath?: StringFilter<"AffidavitTemplate"> | string
    structure?: JsonFilter<"AffidavitTemplate">
    version?: IntFilter<"AffidavitTemplate"> | number
    createdAt?: DateTimeFilter<"AffidavitTemplate"> | Date | string
    updatedAt?: DateTimeFilter<"AffidavitTemplate"> | Date | string
  }

  export type AffidavitTemplateOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    filePath?: SortOrder
    structure?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AffidavitTemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: AffidavitTemplateWhereInput | AffidavitTemplateWhereInput[]
    OR?: AffidavitTemplateWhereInput[]
    NOT?: AffidavitTemplateWhereInput | AffidavitTemplateWhereInput[]
    filePath?: StringFilter<"AffidavitTemplate"> | string
    structure?: JsonFilter<"AffidavitTemplate">
    version?: IntFilter<"AffidavitTemplate"> | number
    createdAt?: DateTimeFilter<"AffidavitTemplate"> | Date | string
    updatedAt?: DateTimeFilter<"AffidavitTemplate"> | Date | string
  }, "id" | "name">

  export type AffidavitTemplateOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    filePath?: SortOrder
    structure?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AffidavitTemplateCountOrderByAggregateInput
    _avg?: AffidavitTemplateAvgOrderByAggregateInput
    _max?: AffidavitTemplateMaxOrderByAggregateInput
    _min?: AffidavitTemplateMinOrderByAggregateInput
    _sum?: AffidavitTemplateSumOrderByAggregateInput
  }

  export type AffidavitTemplateScalarWhereWithAggregatesInput = {
    AND?: AffidavitTemplateScalarWhereWithAggregatesInput | AffidavitTemplateScalarWhereWithAggregatesInput[]
    OR?: AffidavitTemplateScalarWhereWithAggregatesInput[]
    NOT?: AffidavitTemplateScalarWhereWithAggregatesInput | AffidavitTemplateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AffidavitTemplate"> | string
    name?: StringWithAggregatesFilter<"AffidavitTemplate"> | string
    filePath?: StringWithAggregatesFilter<"AffidavitTemplate"> | string
    structure?: JsonWithAggregatesFilter<"AffidavitTemplate">
    version?: IntWithAggregatesFilter<"AffidavitTemplate"> | number
    createdAt?: DateTimeWithAggregatesFilter<"AffidavitTemplate"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AffidavitTemplate"> | Date | string
  }

  export type AffidavitWhereInput = {
    AND?: AffidavitWhereInput | AffidavitWhereInput[]
    OR?: AffidavitWhereInput[]
    NOT?: AffidavitWhereInput | AffidavitWhereInput[]
    id?: StringFilter<"Affidavit"> | string
    patientId?: StringFilter<"Affidavit"> | string
    providerId?: StringFilter<"Affidavit"> | string
    content?: StringFilter<"Affidavit"> | string
    status?: EnumAffidavitStatusFilter<"Affidavit"> | $Enums.AffidavitStatus
    createdAt?: DateTimeFilter<"Affidavit"> | Date | string
    updatedAt?: DateTimeFilter<"Affidavit"> | Date | string
    patient?: XOR<PatientScalarRelationFilter, PatientWhereInput>
    provider?: XOR<ProviderScalarRelationFilter, ProviderWhereInput>
  }

  export type AffidavitOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    content?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    patient?: PatientOrderByWithRelationInput
    provider?: ProviderOrderByWithRelationInput
  }

  export type AffidavitWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AffidavitWhereInput | AffidavitWhereInput[]
    OR?: AffidavitWhereInput[]
    NOT?: AffidavitWhereInput | AffidavitWhereInput[]
    patientId?: StringFilter<"Affidavit"> | string
    providerId?: StringFilter<"Affidavit"> | string
    content?: StringFilter<"Affidavit"> | string
    status?: EnumAffidavitStatusFilter<"Affidavit"> | $Enums.AffidavitStatus
    createdAt?: DateTimeFilter<"Affidavit"> | Date | string
    updatedAt?: DateTimeFilter<"Affidavit"> | Date | string
    patient?: XOR<PatientScalarRelationFilter, PatientWhereInput>
    provider?: XOR<ProviderScalarRelationFilter, ProviderWhereInput>
  }, "id">

  export type AffidavitOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    content?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AffidavitCountOrderByAggregateInput
    _max?: AffidavitMaxOrderByAggregateInput
    _min?: AffidavitMinOrderByAggregateInput
  }

  export type AffidavitScalarWhereWithAggregatesInput = {
    AND?: AffidavitScalarWhereWithAggregatesInput | AffidavitScalarWhereWithAggregatesInput[]
    OR?: AffidavitScalarWhereWithAggregatesInput[]
    NOT?: AffidavitScalarWhereWithAggregatesInput | AffidavitScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Affidavit"> | string
    patientId?: StringWithAggregatesFilter<"Affidavit"> | string
    providerId?: StringWithAggregatesFilter<"Affidavit"> | string
    content?: StringWithAggregatesFilter<"Affidavit"> | string
    status?: EnumAffidavitStatusWithAggregatesFilter<"Affidavit"> | $Enums.AffidavitStatus
    createdAt?: DateTimeWithAggregatesFilter<"Affidavit"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Affidavit"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientCreateInput = {
    id?: string
    patientName: string
    dateOfBirth: Date | string
    dateOfInjury: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    providers?: PatientProviderCreateNestedManyWithoutPatientInput
    affidavits?: AffidavitCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateInput = {
    id?: string
    patientName: string
    dateOfBirth: Date | string
    dateOfInjury: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    providers?: PatientProviderUncheckedCreateNestedManyWithoutPatientInput
    affidavits?: AffidavitUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    dateOfInjury?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    providers?: PatientProviderUpdateManyWithoutPatientNestedInput
    affidavits?: AffidavitUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    dateOfInjury?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    providers?: PatientProviderUncheckedUpdateManyWithoutPatientNestedInput
    affidavits?: AffidavitUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type PatientCreateManyInput = {
    id?: string
    patientName: string
    dateOfBirth: Date | string
    dateOfInjury: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    dateOfInjury?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    dateOfInjury?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderCreateInput = {
    id?: string
    name: string
    address: string
    email: string
    phone: string
    createdAt?: Date | string
    updatedAt?: Date | string
    patients?: PatientProviderCreateNestedManyWithoutProviderInput
    affidavits?: AffidavitCreateNestedManyWithoutProviderInput
  }

  export type ProviderUncheckedCreateInput = {
    id?: string
    name: string
    address: string
    email: string
    phone: string
    createdAt?: Date | string
    updatedAt?: Date | string
    patients?: PatientProviderUncheckedCreateNestedManyWithoutProviderInput
    affidavits?: AffidavitUncheckedCreateNestedManyWithoutProviderInput
  }

  export type ProviderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patients?: PatientProviderUpdateManyWithoutProviderNestedInput
    affidavits?: AffidavitUpdateManyWithoutProviderNestedInput
  }

  export type ProviderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patients?: PatientProviderUncheckedUpdateManyWithoutProviderNestedInput
    affidavits?: AffidavitUncheckedUpdateManyWithoutProviderNestedInput
  }

  export type ProviderCreateManyInput = {
    id?: string
    name: string
    address: string
    email: string
    phone: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProviderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientProviderCreateInput = {
    id?: string
    requestType: string
    dosStart: Date | string
    dosEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutProvidersInput
    provider: ProviderCreateNestedOneWithoutPatientsInput
  }

  export type PatientProviderUncheckedCreateInput = {
    id?: string
    patientId: string
    providerId: string
    requestType: string
    dosStart: Date | string
    dosEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientProviderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestType?: StringFieldUpdateOperationsInput | string
    dosStart?: DateTimeFieldUpdateOperationsInput | Date | string
    dosEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutProvidersNestedInput
    provider?: ProviderUpdateOneRequiredWithoutPatientsNestedInput
  }

  export type PatientProviderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    requestType?: StringFieldUpdateOperationsInput | string
    dosStart?: DateTimeFieldUpdateOperationsInput | Date | string
    dosEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientProviderCreateManyInput = {
    id?: string
    patientId: string
    providerId: string
    requestType: string
    dosStart: Date | string
    dosEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientProviderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestType?: StringFieldUpdateOperationsInput | string
    dosStart?: DateTimeFieldUpdateOperationsInput | Date | string
    dosEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientProviderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    requestType?: StringFieldUpdateOperationsInput | string
    dosStart?: DateTimeFieldUpdateOperationsInput | Date | string
    dosEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AffidavitTemplateCreateInput = {
    id?: string
    name: string
    filePath: string
    structure: JsonNullValueInput | InputJsonValue
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AffidavitTemplateUncheckedCreateInput = {
    id?: string
    name: string
    filePath: string
    structure: JsonNullValueInput | InputJsonValue
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AffidavitTemplateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    structure?: JsonNullValueInput | InputJsonValue
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AffidavitTemplateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    structure?: JsonNullValueInput | InputJsonValue
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AffidavitTemplateCreateManyInput = {
    id?: string
    name: string
    filePath: string
    structure: JsonNullValueInput | InputJsonValue
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AffidavitTemplateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    structure?: JsonNullValueInput | InputJsonValue
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AffidavitTemplateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    structure?: JsonNullValueInput | InputJsonValue
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AffidavitCreateInput = {
    id?: string
    content: string
    status?: $Enums.AffidavitStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutAffidavitsInput
    provider: ProviderCreateNestedOneWithoutAffidavitsInput
  }

  export type AffidavitUncheckedCreateInput = {
    id?: string
    patientId: string
    providerId: string
    content: string
    status?: $Enums.AffidavitStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AffidavitUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: EnumAffidavitStatusFieldUpdateOperationsInput | $Enums.AffidavitStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutAffidavitsNestedInput
    provider?: ProviderUpdateOneRequiredWithoutAffidavitsNestedInput
  }

  export type AffidavitUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: EnumAffidavitStatusFieldUpdateOperationsInput | $Enums.AffidavitStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AffidavitCreateManyInput = {
    id?: string
    patientId: string
    providerId: string
    content: string
    status?: $Enums.AffidavitStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AffidavitUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: EnumAffidavitStatusFieldUpdateOperationsInput | $Enums.AffidavitStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AffidavitUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: EnumAffidavitStatusFieldUpdateOperationsInput | $Enums.AffidavitStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[]
    notIn?: $Enums.UserRole[]
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[]
    notIn?: $Enums.UserRole[]
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type PatientProviderListRelationFilter = {
    every?: PatientProviderWhereInput
    some?: PatientProviderWhereInput
    none?: PatientProviderWhereInput
  }

  export type AffidavitListRelationFilter = {
    every?: AffidavitWhereInput
    some?: AffidavitWhereInput
    none?: AffidavitWhereInput
  }

  export type PatientProviderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AffidavitOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PatientCountOrderByAggregateInput = {
    id?: SortOrder
    patientName?: SortOrder
    dateOfBirth?: SortOrder
    dateOfInjury?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientMaxOrderByAggregateInput = {
    id?: SortOrder
    patientName?: SortOrder
    dateOfBirth?: SortOrder
    dateOfInjury?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientMinOrderByAggregateInput = {
    id?: SortOrder
    patientName?: SortOrder
    dateOfBirth?: SortOrder
    dateOfInjury?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProviderCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProviderMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProviderMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type PatientScalarRelationFilter = {
    is?: PatientWhereInput
    isNot?: PatientWhereInput
  }

  export type ProviderScalarRelationFilter = {
    is?: ProviderWhereInput
    isNot?: ProviderWhereInput
  }

  export type PatientProviderCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    requestType?: SortOrder
    dosStart?: SortOrder
    dosEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientProviderMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    requestType?: SortOrder
    dosStart?: SortOrder
    dosEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientProviderMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    requestType?: SortOrder
    dosStart?: SortOrder
    dosEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type AffidavitTemplateCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    filePath?: SortOrder
    structure?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AffidavitTemplateAvgOrderByAggregateInput = {
    version?: SortOrder
  }

  export type AffidavitTemplateMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    filePath?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AffidavitTemplateMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    filePath?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AffidavitTemplateSumOrderByAggregateInput = {
    version?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumAffidavitStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AffidavitStatus | EnumAffidavitStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AffidavitStatus[]
    notIn?: $Enums.AffidavitStatus[]
    not?: NestedEnumAffidavitStatusFilter<$PrismaModel> | $Enums.AffidavitStatus
  }

  export type AffidavitCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    content?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AffidavitMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    content?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AffidavitMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    content?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumAffidavitStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AffidavitStatus | EnumAffidavitStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AffidavitStatus[]
    notIn?: $Enums.AffidavitStatus[]
    not?: NestedEnumAffidavitStatusWithAggregatesFilter<$PrismaModel> | $Enums.AffidavitStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAffidavitStatusFilter<$PrismaModel>
    _max?: NestedEnumAffidavitStatusFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PatientProviderCreateNestedManyWithoutPatientInput = {
    create?: XOR<PatientProviderCreateWithoutPatientInput, PatientProviderUncheckedCreateWithoutPatientInput> | PatientProviderCreateWithoutPatientInput[] | PatientProviderUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientProviderCreateOrConnectWithoutPatientInput | PatientProviderCreateOrConnectWithoutPatientInput[]
    createMany?: PatientProviderCreateManyPatientInputEnvelope
    connect?: PatientProviderWhereUniqueInput | PatientProviderWhereUniqueInput[]
  }

  export type AffidavitCreateNestedManyWithoutPatientInput = {
    create?: XOR<AffidavitCreateWithoutPatientInput, AffidavitUncheckedCreateWithoutPatientInput> | AffidavitCreateWithoutPatientInput[] | AffidavitUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AffidavitCreateOrConnectWithoutPatientInput | AffidavitCreateOrConnectWithoutPatientInput[]
    createMany?: AffidavitCreateManyPatientInputEnvelope
    connect?: AffidavitWhereUniqueInput | AffidavitWhereUniqueInput[]
  }

  export type PatientProviderUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<PatientProviderCreateWithoutPatientInput, PatientProviderUncheckedCreateWithoutPatientInput> | PatientProviderCreateWithoutPatientInput[] | PatientProviderUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientProviderCreateOrConnectWithoutPatientInput | PatientProviderCreateOrConnectWithoutPatientInput[]
    createMany?: PatientProviderCreateManyPatientInputEnvelope
    connect?: PatientProviderWhereUniqueInput | PatientProviderWhereUniqueInput[]
  }

  export type AffidavitUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<AffidavitCreateWithoutPatientInput, AffidavitUncheckedCreateWithoutPatientInput> | AffidavitCreateWithoutPatientInput[] | AffidavitUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AffidavitCreateOrConnectWithoutPatientInput | AffidavitCreateOrConnectWithoutPatientInput[]
    createMany?: AffidavitCreateManyPatientInputEnvelope
    connect?: AffidavitWhereUniqueInput | AffidavitWhereUniqueInput[]
  }

  export type PatientProviderUpdateManyWithoutPatientNestedInput = {
    create?: XOR<PatientProviderCreateWithoutPatientInput, PatientProviderUncheckedCreateWithoutPatientInput> | PatientProviderCreateWithoutPatientInput[] | PatientProviderUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientProviderCreateOrConnectWithoutPatientInput | PatientProviderCreateOrConnectWithoutPatientInput[]
    upsert?: PatientProviderUpsertWithWhereUniqueWithoutPatientInput | PatientProviderUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: PatientProviderCreateManyPatientInputEnvelope
    set?: PatientProviderWhereUniqueInput | PatientProviderWhereUniqueInput[]
    disconnect?: PatientProviderWhereUniqueInput | PatientProviderWhereUniqueInput[]
    delete?: PatientProviderWhereUniqueInput | PatientProviderWhereUniqueInput[]
    connect?: PatientProviderWhereUniqueInput | PatientProviderWhereUniqueInput[]
    update?: PatientProviderUpdateWithWhereUniqueWithoutPatientInput | PatientProviderUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: PatientProviderUpdateManyWithWhereWithoutPatientInput | PatientProviderUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: PatientProviderScalarWhereInput | PatientProviderScalarWhereInput[]
  }

  export type AffidavitUpdateManyWithoutPatientNestedInput = {
    create?: XOR<AffidavitCreateWithoutPatientInput, AffidavitUncheckedCreateWithoutPatientInput> | AffidavitCreateWithoutPatientInput[] | AffidavitUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AffidavitCreateOrConnectWithoutPatientInput | AffidavitCreateOrConnectWithoutPatientInput[]
    upsert?: AffidavitUpsertWithWhereUniqueWithoutPatientInput | AffidavitUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: AffidavitCreateManyPatientInputEnvelope
    set?: AffidavitWhereUniqueInput | AffidavitWhereUniqueInput[]
    disconnect?: AffidavitWhereUniqueInput | AffidavitWhereUniqueInput[]
    delete?: AffidavitWhereUniqueInput | AffidavitWhereUniqueInput[]
    connect?: AffidavitWhereUniqueInput | AffidavitWhereUniqueInput[]
    update?: AffidavitUpdateWithWhereUniqueWithoutPatientInput | AffidavitUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: AffidavitUpdateManyWithWhereWithoutPatientInput | AffidavitUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: AffidavitScalarWhereInput | AffidavitScalarWhereInput[]
  }

  export type PatientProviderUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<PatientProviderCreateWithoutPatientInput, PatientProviderUncheckedCreateWithoutPatientInput> | PatientProviderCreateWithoutPatientInput[] | PatientProviderUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientProviderCreateOrConnectWithoutPatientInput | PatientProviderCreateOrConnectWithoutPatientInput[]
    upsert?: PatientProviderUpsertWithWhereUniqueWithoutPatientInput | PatientProviderUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: PatientProviderCreateManyPatientInputEnvelope
    set?: PatientProviderWhereUniqueInput | PatientProviderWhereUniqueInput[]
    disconnect?: PatientProviderWhereUniqueInput | PatientProviderWhereUniqueInput[]
    delete?: PatientProviderWhereUniqueInput | PatientProviderWhereUniqueInput[]
    connect?: PatientProviderWhereUniqueInput | PatientProviderWhereUniqueInput[]
    update?: PatientProviderUpdateWithWhereUniqueWithoutPatientInput | PatientProviderUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: PatientProviderUpdateManyWithWhereWithoutPatientInput | PatientProviderUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: PatientProviderScalarWhereInput | PatientProviderScalarWhereInput[]
  }

  export type AffidavitUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<AffidavitCreateWithoutPatientInput, AffidavitUncheckedCreateWithoutPatientInput> | AffidavitCreateWithoutPatientInput[] | AffidavitUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AffidavitCreateOrConnectWithoutPatientInput | AffidavitCreateOrConnectWithoutPatientInput[]
    upsert?: AffidavitUpsertWithWhereUniqueWithoutPatientInput | AffidavitUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: AffidavitCreateManyPatientInputEnvelope
    set?: AffidavitWhereUniqueInput | AffidavitWhereUniqueInput[]
    disconnect?: AffidavitWhereUniqueInput | AffidavitWhereUniqueInput[]
    delete?: AffidavitWhereUniqueInput | AffidavitWhereUniqueInput[]
    connect?: AffidavitWhereUniqueInput | AffidavitWhereUniqueInput[]
    update?: AffidavitUpdateWithWhereUniqueWithoutPatientInput | AffidavitUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: AffidavitUpdateManyWithWhereWithoutPatientInput | AffidavitUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: AffidavitScalarWhereInput | AffidavitScalarWhereInput[]
  }

  export type PatientProviderCreateNestedManyWithoutProviderInput = {
    create?: XOR<PatientProviderCreateWithoutProviderInput, PatientProviderUncheckedCreateWithoutProviderInput> | PatientProviderCreateWithoutProviderInput[] | PatientProviderUncheckedCreateWithoutProviderInput[]
    connectOrCreate?: PatientProviderCreateOrConnectWithoutProviderInput | PatientProviderCreateOrConnectWithoutProviderInput[]
    createMany?: PatientProviderCreateManyProviderInputEnvelope
    connect?: PatientProviderWhereUniqueInput | PatientProviderWhereUniqueInput[]
  }

  export type AffidavitCreateNestedManyWithoutProviderInput = {
    create?: XOR<AffidavitCreateWithoutProviderInput, AffidavitUncheckedCreateWithoutProviderInput> | AffidavitCreateWithoutProviderInput[] | AffidavitUncheckedCreateWithoutProviderInput[]
    connectOrCreate?: AffidavitCreateOrConnectWithoutProviderInput | AffidavitCreateOrConnectWithoutProviderInput[]
    createMany?: AffidavitCreateManyProviderInputEnvelope
    connect?: AffidavitWhereUniqueInput | AffidavitWhereUniqueInput[]
  }

  export type PatientProviderUncheckedCreateNestedManyWithoutProviderInput = {
    create?: XOR<PatientProviderCreateWithoutProviderInput, PatientProviderUncheckedCreateWithoutProviderInput> | PatientProviderCreateWithoutProviderInput[] | PatientProviderUncheckedCreateWithoutProviderInput[]
    connectOrCreate?: PatientProviderCreateOrConnectWithoutProviderInput | PatientProviderCreateOrConnectWithoutProviderInput[]
    createMany?: PatientProviderCreateManyProviderInputEnvelope
    connect?: PatientProviderWhereUniqueInput | PatientProviderWhereUniqueInput[]
  }

  export type AffidavitUncheckedCreateNestedManyWithoutProviderInput = {
    create?: XOR<AffidavitCreateWithoutProviderInput, AffidavitUncheckedCreateWithoutProviderInput> | AffidavitCreateWithoutProviderInput[] | AffidavitUncheckedCreateWithoutProviderInput[]
    connectOrCreate?: AffidavitCreateOrConnectWithoutProviderInput | AffidavitCreateOrConnectWithoutProviderInput[]
    createMany?: AffidavitCreateManyProviderInputEnvelope
    connect?: AffidavitWhereUniqueInput | AffidavitWhereUniqueInput[]
  }

  export type PatientProviderUpdateManyWithoutProviderNestedInput = {
    create?: XOR<PatientProviderCreateWithoutProviderInput, PatientProviderUncheckedCreateWithoutProviderInput> | PatientProviderCreateWithoutProviderInput[] | PatientProviderUncheckedCreateWithoutProviderInput[]
    connectOrCreate?: PatientProviderCreateOrConnectWithoutProviderInput | PatientProviderCreateOrConnectWithoutProviderInput[]
    upsert?: PatientProviderUpsertWithWhereUniqueWithoutProviderInput | PatientProviderUpsertWithWhereUniqueWithoutProviderInput[]
    createMany?: PatientProviderCreateManyProviderInputEnvelope
    set?: PatientProviderWhereUniqueInput | PatientProviderWhereUniqueInput[]
    disconnect?: PatientProviderWhereUniqueInput | PatientProviderWhereUniqueInput[]
    delete?: PatientProviderWhereUniqueInput | PatientProviderWhereUniqueInput[]
    connect?: PatientProviderWhereUniqueInput | PatientProviderWhereUniqueInput[]
    update?: PatientProviderUpdateWithWhereUniqueWithoutProviderInput | PatientProviderUpdateWithWhereUniqueWithoutProviderInput[]
    updateMany?: PatientProviderUpdateManyWithWhereWithoutProviderInput | PatientProviderUpdateManyWithWhereWithoutProviderInput[]
    deleteMany?: PatientProviderScalarWhereInput | PatientProviderScalarWhereInput[]
  }

  export type AffidavitUpdateManyWithoutProviderNestedInput = {
    create?: XOR<AffidavitCreateWithoutProviderInput, AffidavitUncheckedCreateWithoutProviderInput> | AffidavitCreateWithoutProviderInput[] | AffidavitUncheckedCreateWithoutProviderInput[]
    connectOrCreate?: AffidavitCreateOrConnectWithoutProviderInput | AffidavitCreateOrConnectWithoutProviderInput[]
    upsert?: AffidavitUpsertWithWhereUniqueWithoutProviderInput | AffidavitUpsertWithWhereUniqueWithoutProviderInput[]
    createMany?: AffidavitCreateManyProviderInputEnvelope
    set?: AffidavitWhereUniqueInput | AffidavitWhereUniqueInput[]
    disconnect?: AffidavitWhereUniqueInput | AffidavitWhereUniqueInput[]
    delete?: AffidavitWhereUniqueInput | AffidavitWhereUniqueInput[]
    connect?: AffidavitWhereUniqueInput | AffidavitWhereUniqueInput[]
    update?: AffidavitUpdateWithWhereUniqueWithoutProviderInput | AffidavitUpdateWithWhereUniqueWithoutProviderInput[]
    updateMany?: AffidavitUpdateManyWithWhereWithoutProviderInput | AffidavitUpdateManyWithWhereWithoutProviderInput[]
    deleteMany?: AffidavitScalarWhereInput | AffidavitScalarWhereInput[]
  }

  export type PatientProviderUncheckedUpdateManyWithoutProviderNestedInput = {
    create?: XOR<PatientProviderCreateWithoutProviderInput, PatientProviderUncheckedCreateWithoutProviderInput> | PatientProviderCreateWithoutProviderInput[] | PatientProviderUncheckedCreateWithoutProviderInput[]
    connectOrCreate?: PatientProviderCreateOrConnectWithoutProviderInput | PatientProviderCreateOrConnectWithoutProviderInput[]
    upsert?: PatientProviderUpsertWithWhereUniqueWithoutProviderInput | PatientProviderUpsertWithWhereUniqueWithoutProviderInput[]
    createMany?: PatientProviderCreateManyProviderInputEnvelope
    set?: PatientProviderWhereUniqueInput | PatientProviderWhereUniqueInput[]
    disconnect?: PatientProviderWhereUniqueInput | PatientProviderWhereUniqueInput[]
    delete?: PatientProviderWhereUniqueInput | PatientProviderWhereUniqueInput[]
    connect?: PatientProviderWhereUniqueInput | PatientProviderWhereUniqueInput[]
    update?: PatientProviderUpdateWithWhereUniqueWithoutProviderInput | PatientProviderUpdateWithWhereUniqueWithoutProviderInput[]
    updateMany?: PatientProviderUpdateManyWithWhereWithoutProviderInput | PatientProviderUpdateManyWithWhereWithoutProviderInput[]
    deleteMany?: PatientProviderScalarWhereInput | PatientProviderScalarWhereInput[]
  }

  export type AffidavitUncheckedUpdateManyWithoutProviderNestedInput = {
    create?: XOR<AffidavitCreateWithoutProviderInput, AffidavitUncheckedCreateWithoutProviderInput> | AffidavitCreateWithoutProviderInput[] | AffidavitUncheckedCreateWithoutProviderInput[]
    connectOrCreate?: AffidavitCreateOrConnectWithoutProviderInput | AffidavitCreateOrConnectWithoutProviderInput[]
    upsert?: AffidavitUpsertWithWhereUniqueWithoutProviderInput | AffidavitUpsertWithWhereUniqueWithoutProviderInput[]
    createMany?: AffidavitCreateManyProviderInputEnvelope
    set?: AffidavitWhereUniqueInput | AffidavitWhereUniqueInput[]
    disconnect?: AffidavitWhereUniqueInput | AffidavitWhereUniqueInput[]
    delete?: AffidavitWhereUniqueInput | AffidavitWhereUniqueInput[]
    connect?: AffidavitWhereUniqueInput | AffidavitWhereUniqueInput[]
    update?: AffidavitUpdateWithWhereUniqueWithoutProviderInput | AffidavitUpdateWithWhereUniqueWithoutProviderInput[]
    updateMany?: AffidavitUpdateManyWithWhereWithoutProviderInput | AffidavitUpdateManyWithWhereWithoutProviderInput[]
    deleteMany?: AffidavitScalarWhereInput | AffidavitScalarWhereInput[]
  }

  export type PatientCreateNestedOneWithoutProvidersInput = {
    create?: XOR<PatientCreateWithoutProvidersInput, PatientUncheckedCreateWithoutProvidersInput>
    connectOrCreate?: PatientCreateOrConnectWithoutProvidersInput
    connect?: PatientWhereUniqueInput
  }

  export type ProviderCreateNestedOneWithoutPatientsInput = {
    create?: XOR<ProviderCreateWithoutPatientsInput, ProviderUncheckedCreateWithoutPatientsInput>
    connectOrCreate?: ProviderCreateOrConnectWithoutPatientsInput
    connect?: ProviderWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type PatientUpdateOneRequiredWithoutProvidersNestedInput = {
    create?: XOR<PatientCreateWithoutProvidersInput, PatientUncheckedCreateWithoutProvidersInput>
    connectOrCreate?: PatientCreateOrConnectWithoutProvidersInput
    upsert?: PatientUpsertWithoutProvidersInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutProvidersInput, PatientUpdateWithoutProvidersInput>, PatientUncheckedUpdateWithoutProvidersInput>
  }

  export type ProviderUpdateOneRequiredWithoutPatientsNestedInput = {
    create?: XOR<ProviderCreateWithoutPatientsInput, ProviderUncheckedCreateWithoutPatientsInput>
    connectOrCreate?: ProviderCreateOrConnectWithoutPatientsInput
    upsert?: ProviderUpsertWithoutPatientsInput
    connect?: ProviderWhereUniqueInput
    update?: XOR<XOR<ProviderUpdateToOneWithWhereWithoutPatientsInput, ProviderUpdateWithoutPatientsInput>, ProviderUncheckedUpdateWithoutPatientsInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PatientCreateNestedOneWithoutAffidavitsInput = {
    create?: XOR<PatientCreateWithoutAffidavitsInput, PatientUncheckedCreateWithoutAffidavitsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutAffidavitsInput
    connect?: PatientWhereUniqueInput
  }

  export type ProviderCreateNestedOneWithoutAffidavitsInput = {
    create?: XOR<ProviderCreateWithoutAffidavitsInput, ProviderUncheckedCreateWithoutAffidavitsInput>
    connectOrCreate?: ProviderCreateOrConnectWithoutAffidavitsInput
    connect?: ProviderWhereUniqueInput
  }

  export type EnumAffidavitStatusFieldUpdateOperationsInput = {
    set?: $Enums.AffidavitStatus
  }

  export type PatientUpdateOneRequiredWithoutAffidavitsNestedInput = {
    create?: XOR<PatientCreateWithoutAffidavitsInput, PatientUncheckedCreateWithoutAffidavitsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutAffidavitsInput
    upsert?: PatientUpsertWithoutAffidavitsInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutAffidavitsInput, PatientUpdateWithoutAffidavitsInput>, PatientUncheckedUpdateWithoutAffidavitsInput>
  }

  export type ProviderUpdateOneRequiredWithoutAffidavitsNestedInput = {
    create?: XOR<ProviderCreateWithoutAffidavitsInput, ProviderUncheckedCreateWithoutAffidavitsInput>
    connectOrCreate?: ProviderCreateOrConnectWithoutAffidavitsInput
    upsert?: ProviderUpsertWithoutAffidavitsInput
    connect?: ProviderWhereUniqueInput
    update?: XOR<XOR<ProviderUpdateToOneWithWhereWithoutAffidavitsInput, ProviderUpdateWithoutAffidavitsInput>, ProviderUncheckedUpdateWithoutAffidavitsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[]
    notIn?: $Enums.UserRole[]
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[]
    notIn?: $Enums.UserRole[]
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumAffidavitStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AffidavitStatus | EnumAffidavitStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AffidavitStatus[]
    notIn?: $Enums.AffidavitStatus[]
    not?: NestedEnumAffidavitStatusFilter<$PrismaModel> | $Enums.AffidavitStatus
  }

  export type NestedEnumAffidavitStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AffidavitStatus | EnumAffidavitStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AffidavitStatus[]
    notIn?: $Enums.AffidavitStatus[]
    not?: NestedEnumAffidavitStatusWithAggregatesFilter<$PrismaModel> | $Enums.AffidavitStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAffidavitStatusFilter<$PrismaModel>
    _max?: NestedEnumAffidavitStatusFilter<$PrismaModel>
  }

  export type PatientProviderCreateWithoutPatientInput = {
    id?: string
    requestType: string
    dosStart: Date | string
    dosEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    provider: ProviderCreateNestedOneWithoutPatientsInput
  }

  export type PatientProviderUncheckedCreateWithoutPatientInput = {
    id?: string
    providerId: string
    requestType: string
    dosStart: Date | string
    dosEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientProviderCreateOrConnectWithoutPatientInput = {
    where: PatientProviderWhereUniqueInput
    create: XOR<PatientProviderCreateWithoutPatientInput, PatientProviderUncheckedCreateWithoutPatientInput>
  }

  export type PatientProviderCreateManyPatientInputEnvelope = {
    data: PatientProviderCreateManyPatientInput | PatientProviderCreateManyPatientInput[]
  }

  export type AffidavitCreateWithoutPatientInput = {
    id?: string
    content: string
    status?: $Enums.AffidavitStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    provider: ProviderCreateNestedOneWithoutAffidavitsInput
  }

  export type AffidavitUncheckedCreateWithoutPatientInput = {
    id?: string
    providerId: string
    content: string
    status?: $Enums.AffidavitStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AffidavitCreateOrConnectWithoutPatientInput = {
    where: AffidavitWhereUniqueInput
    create: XOR<AffidavitCreateWithoutPatientInput, AffidavitUncheckedCreateWithoutPatientInput>
  }

  export type AffidavitCreateManyPatientInputEnvelope = {
    data: AffidavitCreateManyPatientInput | AffidavitCreateManyPatientInput[]
  }

  export type PatientProviderUpsertWithWhereUniqueWithoutPatientInput = {
    where: PatientProviderWhereUniqueInput
    update: XOR<PatientProviderUpdateWithoutPatientInput, PatientProviderUncheckedUpdateWithoutPatientInput>
    create: XOR<PatientProviderCreateWithoutPatientInput, PatientProviderUncheckedCreateWithoutPatientInput>
  }

  export type PatientProviderUpdateWithWhereUniqueWithoutPatientInput = {
    where: PatientProviderWhereUniqueInput
    data: XOR<PatientProviderUpdateWithoutPatientInput, PatientProviderUncheckedUpdateWithoutPatientInput>
  }

  export type PatientProviderUpdateManyWithWhereWithoutPatientInput = {
    where: PatientProviderScalarWhereInput
    data: XOR<PatientProviderUpdateManyMutationInput, PatientProviderUncheckedUpdateManyWithoutPatientInput>
  }

  export type PatientProviderScalarWhereInput = {
    AND?: PatientProviderScalarWhereInput | PatientProviderScalarWhereInput[]
    OR?: PatientProviderScalarWhereInput[]
    NOT?: PatientProviderScalarWhereInput | PatientProviderScalarWhereInput[]
    id?: StringFilter<"PatientProvider"> | string
    patientId?: StringFilter<"PatientProvider"> | string
    providerId?: StringFilter<"PatientProvider"> | string
    requestType?: StringFilter<"PatientProvider"> | string
    dosStart?: DateTimeFilter<"PatientProvider"> | Date | string
    dosEnd?: DateTimeNullableFilter<"PatientProvider"> | Date | string | null
    createdAt?: DateTimeFilter<"PatientProvider"> | Date | string
    updatedAt?: DateTimeFilter<"PatientProvider"> | Date | string
  }

  export type AffidavitUpsertWithWhereUniqueWithoutPatientInput = {
    where: AffidavitWhereUniqueInput
    update: XOR<AffidavitUpdateWithoutPatientInput, AffidavitUncheckedUpdateWithoutPatientInput>
    create: XOR<AffidavitCreateWithoutPatientInput, AffidavitUncheckedCreateWithoutPatientInput>
  }

  export type AffidavitUpdateWithWhereUniqueWithoutPatientInput = {
    where: AffidavitWhereUniqueInput
    data: XOR<AffidavitUpdateWithoutPatientInput, AffidavitUncheckedUpdateWithoutPatientInput>
  }

  export type AffidavitUpdateManyWithWhereWithoutPatientInput = {
    where: AffidavitScalarWhereInput
    data: XOR<AffidavitUpdateManyMutationInput, AffidavitUncheckedUpdateManyWithoutPatientInput>
  }

  export type AffidavitScalarWhereInput = {
    AND?: AffidavitScalarWhereInput | AffidavitScalarWhereInput[]
    OR?: AffidavitScalarWhereInput[]
    NOT?: AffidavitScalarWhereInput | AffidavitScalarWhereInput[]
    id?: StringFilter<"Affidavit"> | string
    patientId?: StringFilter<"Affidavit"> | string
    providerId?: StringFilter<"Affidavit"> | string
    content?: StringFilter<"Affidavit"> | string
    status?: EnumAffidavitStatusFilter<"Affidavit"> | $Enums.AffidavitStatus
    createdAt?: DateTimeFilter<"Affidavit"> | Date | string
    updatedAt?: DateTimeFilter<"Affidavit"> | Date | string
  }

  export type PatientProviderCreateWithoutProviderInput = {
    id?: string
    requestType: string
    dosStart: Date | string
    dosEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutProvidersInput
  }

  export type PatientProviderUncheckedCreateWithoutProviderInput = {
    id?: string
    patientId: string
    requestType: string
    dosStart: Date | string
    dosEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientProviderCreateOrConnectWithoutProviderInput = {
    where: PatientProviderWhereUniqueInput
    create: XOR<PatientProviderCreateWithoutProviderInput, PatientProviderUncheckedCreateWithoutProviderInput>
  }

  export type PatientProviderCreateManyProviderInputEnvelope = {
    data: PatientProviderCreateManyProviderInput | PatientProviderCreateManyProviderInput[]
  }

  export type AffidavitCreateWithoutProviderInput = {
    id?: string
    content: string
    status?: $Enums.AffidavitStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutAffidavitsInput
  }

  export type AffidavitUncheckedCreateWithoutProviderInput = {
    id?: string
    patientId: string
    content: string
    status?: $Enums.AffidavitStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AffidavitCreateOrConnectWithoutProviderInput = {
    where: AffidavitWhereUniqueInput
    create: XOR<AffidavitCreateWithoutProviderInput, AffidavitUncheckedCreateWithoutProviderInput>
  }

  export type AffidavitCreateManyProviderInputEnvelope = {
    data: AffidavitCreateManyProviderInput | AffidavitCreateManyProviderInput[]
  }

  export type PatientProviderUpsertWithWhereUniqueWithoutProviderInput = {
    where: PatientProviderWhereUniqueInput
    update: XOR<PatientProviderUpdateWithoutProviderInput, PatientProviderUncheckedUpdateWithoutProviderInput>
    create: XOR<PatientProviderCreateWithoutProviderInput, PatientProviderUncheckedCreateWithoutProviderInput>
  }

  export type PatientProviderUpdateWithWhereUniqueWithoutProviderInput = {
    where: PatientProviderWhereUniqueInput
    data: XOR<PatientProviderUpdateWithoutProviderInput, PatientProviderUncheckedUpdateWithoutProviderInput>
  }

  export type PatientProviderUpdateManyWithWhereWithoutProviderInput = {
    where: PatientProviderScalarWhereInput
    data: XOR<PatientProviderUpdateManyMutationInput, PatientProviderUncheckedUpdateManyWithoutProviderInput>
  }

  export type AffidavitUpsertWithWhereUniqueWithoutProviderInput = {
    where: AffidavitWhereUniqueInput
    update: XOR<AffidavitUpdateWithoutProviderInput, AffidavitUncheckedUpdateWithoutProviderInput>
    create: XOR<AffidavitCreateWithoutProviderInput, AffidavitUncheckedCreateWithoutProviderInput>
  }

  export type AffidavitUpdateWithWhereUniqueWithoutProviderInput = {
    where: AffidavitWhereUniqueInput
    data: XOR<AffidavitUpdateWithoutProviderInput, AffidavitUncheckedUpdateWithoutProviderInput>
  }

  export type AffidavitUpdateManyWithWhereWithoutProviderInput = {
    where: AffidavitScalarWhereInput
    data: XOR<AffidavitUpdateManyMutationInput, AffidavitUncheckedUpdateManyWithoutProviderInput>
  }

  export type PatientCreateWithoutProvidersInput = {
    id?: string
    patientName: string
    dateOfBirth: Date | string
    dateOfInjury: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    affidavits?: AffidavitCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutProvidersInput = {
    id?: string
    patientName: string
    dateOfBirth: Date | string
    dateOfInjury: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    affidavits?: AffidavitUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutProvidersInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutProvidersInput, PatientUncheckedCreateWithoutProvidersInput>
  }

  export type ProviderCreateWithoutPatientsInput = {
    id?: string
    name: string
    address: string
    email: string
    phone: string
    createdAt?: Date | string
    updatedAt?: Date | string
    affidavits?: AffidavitCreateNestedManyWithoutProviderInput
  }

  export type ProviderUncheckedCreateWithoutPatientsInput = {
    id?: string
    name: string
    address: string
    email: string
    phone: string
    createdAt?: Date | string
    updatedAt?: Date | string
    affidavits?: AffidavitUncheckedCreateNestedManyWithoutProviderInput
  }

  export type ProviderCreateOrConnectWithoutPatientsInput = {
    where: ProviderWhereUniqueInput
    create: XOR<ProviderCreateWithoutPatientsInput, ProviderUncheckedCreateWithoutPatientsInput>
  }

  export type PatientUpsertWithoutProvidersInput = {
    update: XOR<PatientUpdateWithoutProvidersInput, PatientUncheckedUpdateWithoutProvidersInput>
    create: XOR<PatientCreateWithoutProvidersInput, PatientUncheckedCreateWithoutProvidersInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutProvidersInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutProvidersInput, PatientUncheckedUpdateWithoutProvidersInput>
  }

  export type PatientUpdateWithoutProvidersInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    dateOfInjury?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    affidavits?: AffidavitUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutProvidersInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    dateOfInjury?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    affidavits?: AffidavitUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type ProviderUpsertWithoutPatientsInput = {
    update: XOR<ProviderUpdateWithoutPatientsInput, ProviderUncheckedUpdateWithoutPatientsInput>
    create: XOR<ProviderCreateWithoutPatientsInput, ProviderUncheckedCreateWithoutPatientsInput>
    where?: ProviderWhereInput
  }

  export type ProviderUpdateToOneWithWhereWithoutPatientsInput = {
    where?: ProviderWhereInput
    data: XOR<ProviderUpdateWithoutPatientsInput, ProviderUncheckedUpdateWithoutPatientsInput>
  }

  export type ProviderUpdateWithoutPatientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    affidavits?: AffidavitUpdateManyWithoutProviderNestedInput
  }

  export type ProviderUncheckedUpdateWithoutPatientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    affidavits?: AffidavitUncheckedUpdateManyWithoutProviderNestedInput
  }

  export type PatientCreateWithoutAffidavitsInput = {
    id?: string
    patientName: string
    dateOfBirth: Date | string
    dateOfInjury: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    providers?: PatientProviderCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutAffidavitsInput = {
    id?: string
    patientName: string
    dateOfBirth: Date | string
    dateOfInjury: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    providers?: PatientProviderUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutAffidavitsInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutAffidavitsInput, PatientUncheckedCreateWithoutAffidavitsInput>
  }

  export type ProviderCreateWithoutAffidavitsInput = {
    id?: string
    name: string
    address: string
    email: string
    phone: string
    createdAt?: Date | string
    updatedAt?: Date | string
    patients?: PatientProviderCreateNestedManyWithoutProviderInput
  }

  export type ProviderUncheckedCreateWithoutAffidavitsInput = {
    id?: string
    name: string
    address: string
    email: string
    phone: string
    createdAt?: Date | string
    updatedAt?: Date | string
    patients?: PatientProviderUncheckedCreateNestedManyWithoutProviderInput
  }

  export type ProviderCreateOrConnectWithoutAffidavitsInput = {
    where: ProviderWhereUniqueInput
    create: XOR<ProviderCreateWithoutAffidavitsInput, ProviderUncheckedCreateWithoutAffidavitsInput>
  }

  export type PatientUpsertWithoutAffidavitsInput = {
    update: XOR<PatientUpdateWithoutAffidavitsInput, PatientUncheckedUpdateWithoutAffidavitsInput>
    create: XOR<PatientCreateWithoutAffidavitsInput, PatientUncheckedCreateWithoutAffidavitsInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutAffidavitsInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutAffidavitsInput, PatientUncheckedUpdateWithoutAffidavitsInput>
  }

  export type PatientUpdateWithoutAffidavitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    dateOfInjury?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    providers?: PatientProviderUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutAffidavitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    dateOfInjury?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    providers?: PatientProviderUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type ProviderUpsertWithoutAffidavitsInput = {
    update: XOR<ProviderUpdateWithoutAffidavitsInput, ProviderUncheckedUpdateWithoutAffidavitsInput>
    create: XOR<ProviderCreateWithoutAffidavitsInput, ProviderUncheckedCreateWithoutAffidavitsInput>
    where?: ProviderWhereInput
  }

  export type ProviderUpdateToOneWithWhereWithoutAffidavitsInput = {
    where?: ProviderWhereInput
    data: XOR<ProviderUpdateWithoutAffidavitsInput, ProviderUncheckedUpdateWithoutAffidavitsInput>
  }

  export type ProviderUpdateWithoutAffidavitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patients?: PatientProviderUpdateManyWithoutProviderNestedInput
  }

  export type ProviderUncheckedUpdateWithoutAffidavitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patients?: PatientProviderUncheckedUpdateManyWithoutProviderNestedInput
  }

  export type PatientProviderCreateManyPatientInput = {
    id?: string
    providerId: string
    requestType: string
    dosStart: Date | string
    dosEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AffidavitCreateManyPatientInput = {
    id?: string
    providerId: string
    content: string
    status?: $Enums.AffidavitStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientProviderUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestType?: StringFieldUpdateOperationsInput | string
    dosStart?: DateTimeFieldUpdateOperationsInput | Date | string
    dosEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    provider?: ProviderUpdateOneRequiredWithoutPatientsNestedInput
  }

  export type PatientProviderUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    requestType?: StringFieldUpdateOperationsInput | string
    dosStart?: DateTimeFieldUpdateOperationsInput | Date | string
    dosEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientProviderUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    requestType?: StringFieldUpdateOperationsInput | string
    dosStart?: DateTimeFieldUpdateOperationsInput | Date | string
    dosEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AffidavitUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: EnumAffidavitStatusFieldUpdateOperationsInput | $Enums.AffidavitStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    provider?: ProviderUpdateOneRequiredWithoutAffidavitsNestedInput
  }

  export type AffidavitUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: EnumAffidavitStatusFieldUpdateOperationsInput | $Enums.AffidavitStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AffidavitUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: EnumAffidavitStatusFieldUpdateOperationsInput | $Enums.AffidavitStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientProviderCreateManyProviderInput = {
    id?: string
    patientId: string
    requestType: string
    dosStart: Date | string
    dosEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AffidavitCreateManyProviderInput = {
    id?: string
    patientId: string
    content: string
    status?: $Enums.AffidavitStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientProviderUpdateWithoutProviderInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestType?: StringFieldUpdateOperationsInput | string
    dosStart?: DateTimeFieldUpdateOperationsInput | Date | string
    dosEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutProvidersNestedInput
  }

  export type PatientProviderUncheckedUpdateWithoutProviderInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    requestType?: StringFieldUpdateOperationsInput | string
    dosStart?: DateTimeFieldUpdateOperationsInput | Date | string
    dosEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientProviderUncheckedUpdateManyWithoutProviderInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    requestType?: StringFieldUpdateOperationsInput | string
    dosStart?: DateTimeFieldUpdateOperationsInput | Date | string
    dosEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AffidavitUpdateWithoutProviderInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: EnumAffidavitStatusFieldUpdateOperationsInput | $Enums.AffidavitStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutAffidavitsNestedInput
  }

  export type AffidavitUncheckedUpdateWithoutProviderInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: EnumAffidavitStatusFieldUpdateOperationsInput | $Enums.AffidavitStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AffidavitUncheckedUpdateManyWithoutProviderInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: EnumAffidavitStatusFieldUpdateOperationsInput | $Enums.AffidavitStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}