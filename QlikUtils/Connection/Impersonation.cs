using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Runtime.InteropServices;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using Qlik.Engine;

namespace QlikUtils
{
    class Impersonation
    {
        public static int LOGON32_LOGON_INTERACTIVE = 2;
        public static int LOGON32_PROVIDER_DEFAULT = 0;

        [DllImport("advapi32.dll")]
        public static extern int LogonUserA(string lpxzUsername, string lpzDomain, string lpzPassword, int dwLogonType, int dwLogonProvider, ref IntPtr phToken);
        [DllImport("advapi32.dll")]
        public static extern int DuplicateToken(IntPtr ExistingTokenHandle, int ImpersonationLevel, ref IntPtr DuplicateTokenHandle);
        [DllImport("advapi32.dll")]
        public static extern long RevertToSelf();

        [DllImport("Kernel32.dll")]
        public static extern long CloseHandle(IntPtr handle);

        public static WindowsImpersonationContext impersonationContext;

        public static bool impersonateValidUser(string userName, string domain, string password)
        {
            WindowsIdentity tempWindowsIdentity;
            IntPtr token = IntPtr.Zero;
            IntPtr tokenDuplicate = IntPtr.Zero;
            bool ValidUser = false;

            if (RevertToSelf() != 0)
            {
                if (LogonUserA(userName, domain, password, LOGON32_LOGON_INTERACTIVE, LOGON32_PROVIDER_DEFAULT, ref token) != 0)
                {
                    if (DuplicateToken(token, 2, ref tokenDuplicate) != 0)
                    {
                        tempWindowsIdentity = new WindowsIdentity(tokenDuplicate);
                        impersonationContext = tempWindowsIdentity.Impersonate();
                        if (impersonationContext != null)
                        {
                            ValidUser = true;
                        }
                    }
                }
            }

            if (!tokenDuplicate.Equals(IntPtr.Zero))
            {
                CloseHandle(tokenDuplicate);
            }
            if (!token.Equals(IntPtr.Zero))
            {
                CloseHandle(token);
            }
            return ValidUser;

        }

        public static void undoImpersonation()
        {
            try
            {
                impersonationContext.Undo();
            }
            catch
            {
            }
        }

    }
}
