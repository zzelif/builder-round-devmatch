declare module "@prisma/nextjs-monorepo-workaround-plugin" {
  import { Compiler } from "webpack";

  export interface PrismaPluginOptions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }

  export class PrismaPlugin {
    constructor(options?: PrismaPluginOptions);
    apply(compiler: Compiler): void;
  }
}
