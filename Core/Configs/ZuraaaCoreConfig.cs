using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Zuraaa.Core.Configs
{
    public class ZuraaaCoreConfig
    {
        public string Port { get; set; } = Environment.GetEnvironmentVariable("ZURAAA_CORE_PORT") ?? "3000";
    }
}
