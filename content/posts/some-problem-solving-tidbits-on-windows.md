+++
title = 'Some Problem Solving Tidbits on Windows'
date = 2024-04-20T18:47:14+02:00
series = "System Administration"
tags = ["Windows", "MS365", "Virtualization"]
summary = "Working with Windows can be quite the chore. The user, not to mention the administrator, can face many unique and mysterious challenges. I gathered here some problems I faced during my time as a system administrator with the way to solve each. These issues are completely unrelated. The only thing that connects them is that they are specific to Windows and Microsoft products."
+++

## [Table of Contents]

- [Useful shortcuts](#useful-shortcuts)
- [Disable Windows Web Search](#disable-windows-web-search)
- [Install Windows without internet and (more importantly) without a Microsoft account](#install-windows-without-internet-and-more-importantly-without-a-microsoft-account)
- [How to get the serial number of the PC/laptop](#how-to-get-the-serial-number-of-the-pclaptop)
- [Delete file associations](#delete-file-associations)
- [Solving DNS issues](#solving-dns-issues)
- [Increase the maximum size of Outlook attachments](#increase-the-maximum-size-of-outlook-attachments)
- [Block users from deleting tasks not created by them in Microsoft 365 Planner](#block-users-from-deleting-tasks-not-created-by-them-in-microsoft-365-planner)
- [Disable Hyper-V](#disable-hyper-v)
- [Windows SysInternals Suite](#windows-sysinternals-suite)

## Useful shortcuts

I saw many people using `Ctrl+Alt+Del` to open the **Task Manager** in Windows. However, I find `Ctrl+Shift+Escape` to be a much faster and easier method.

To open the **command line as administrator** just run `WIN+R`, type `cmd` and `Ctrl+Shift+Enter` opens an elevated command line.

Working with the **Control Panel**, I found myself using only a few components regularly, so for those I use the built-in shortcuts after running `WIN+R`.

| Command      | Opens                                                                                                                                                                                  |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| desk.cpl     | Display settings.                                                                                                                                                                      |
| inetcpl.cpl  | Internet options for installing certificates etc.                                                                                                                                      |
| intl.cpl     | Region for managing date formats etc.                                                                                                                                                  |
| ncpa.cpl     | Network Connections to manage network adapter settings.                                                                                                                                |
| sysdm.cpl    | Advanced System Settings e. g. to set environment variables (okay, technically, you can reach it with one command, `rundll32.exe sysdm.cpl,EditEnvironmentVariables`, but come on...). |
| timedate.cpl | Time and Date settings.                                                                                                                                                                |

`wf.msc` opens the **Windows Firewall with Advanced Security**, where the inbound and outbound rules can be modified if needed.

Now, there are some issues that I faced when an application's icon cannot be found anywhere on the file system, but it certainly exists, as I can type it in the search bar, it comes up, can be opened. But I cannot create shortcuts for it, because it is in a special folder. Again, `WIN+R`, type `shell:AppsFolder` and the **Apps Folder** opens that cannot be reached normally from the File Explorer.

## Disable Windows Web Search

Run `WIN+R`, type `regedit`.

Navigate to `HKEY_CURRENT_USER\SOFTWARE\Policies\Microsoft\Windows`.

Create a new Key (basically a folder), name it `Explorer`. Open it.

Create a new DWORD (32-bit) Value, name it `DisableSearchBoxSuggestions`. Double-click on it, set the Value data to `1`.

Reboot your computer.

Now, if you search for something, you won't get those annoying web search results, only the things that actually exist on your computer.

## Install Windows without internet and (more importantly) without a Microsoft account

When the installation screen comes up, you choose a language, a keyboard layout, then Windows prompts you to select an internet connection. From there you can only go forward with signing in to a Microsoft account. But there is way to add a local user straight from the start. On the internet selection screen, you should see an _'I have no internet'_ option, and from then you can continue with just a local user. This option is **hidden by default**.

To add the option, on the installation screen, before selecting an internet connection, press `Shift+Fn+F10`, this opens the command line.

Then add the following registry key.

```cmd
reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\OOBE /v BypassNRO /t REG_DWORD /d 1 /f
```

Now restart your computer with the following command.

```cmd
shutdown /r /t 0
```

After the system restarts, choose your language, your keyboard layout, and on the internet selection screen you should see an option _'I have no internet'_. Choose it, then create a local user.

## How to get the serial number of the PC/laptop

This is pretty straightforward. Just type the following command in the command line.

```cmd
wmic bios get serialnumber
```

## Delete file associations

Say, for example, you chose a default application for a specific file extension that you want to delete and reset the file extension's association to default. It can be done, but requires a few steps.

Run `WIN+R`, type `regedit` to open the Registry Editor. Now you must delete the file extension folder from two places.

`HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\FileExts\`, find the appropriate file extension, delete the folder.

`HKEY_CLASSES_ROOT\`, same process as above.

Now, if you restart your computer, the file association is removed. Beware though, if you delete only one of these folders, the file association remains.

## Solving DNS issues

Facing DNS issues can be quite a pain, and sometimes the problem lies with the ISP or the DNS provider. However, when the problem is on our system, there are a few steps that we can try to solve them. The first step should be opening a command line, every command below should be run inside of it. These commands will reset every setting related to your network and DNS services.

```cmd
ipconfig /release
```

```cmd
netsh ip int reset
```

```cmd
netsh winsock reset
```

```cmd
netsh advfirewall reset
```

```cmd
ipconfig /flushdns
```

```cmd
ipconfig /renew
```

Finally, restart your computer.

When you have an **Event ID 1014** on top of the DNS problems, this command should be run in addition to **disable TCP Offload**.

```cmd
ntsh int ip set global taskoffload=disabled
```

If the issue persists, try reinstalling your network drivers. Or wait until next morning.

## Increase the maximum size of Outlook attachments

Turns out, that increasing the maximum attachment size on the mail server is not enough when using Outlook. It must be set explicitly on the client side too. Press `WIN+R`, type `regedit`.

Now, navigate to `HKEY_CURRENT_USER\SOFTWARE\Microsoft\Office\16.0\Outlook\Preferences`.

Right-click, add New DWORD (32 bit) Value. Edit the a DWORD Value. The Name should be `MaximumAttachmentSize`, the Value should be `102400` set to decimal. This will let the Outlook user send 100MB big attachments. You can change the number to make it bigger or smaller.

## Block users from deleting tasks not created by them in Microsoft 365 Planner

Planner is kind of the Trello alternative of Microsoft in the Microsoft 365 ecosystem (there is Project that is more advanced, maybe better, but I have no experience with it). Now, in Planner when we create tasks, by default **every user can delete any task**. It's just below the Move task button and won't even ask for confirmation. It just **deletes the task instantly and permanently**. Whether it is by accident, it doesn't matter. This behaviour can obviosuly cause problems.

Even a confirmation popup would be quite a big QoL feature. Or if we could somehow set the users privileges to not be able to delete any task. Fortunately, this can be achieved. But there is no easy option for it in the settings, **it must be done manually with PowerShell**, and the block policy must be run for every user in the organization one by one. So, below I will show a method, how you can block users from deleting tasks that other users created. The desired outcome is this: **every task can be deleted only by the user who created it**. After this policy is set, two things can happen. Either an error message will pop up when the user clicks on Delete or the Delete option disappears completely from every card excluding those created by the user.

### How to achieve it with PowerShell

**(IMPORTANT: only global admins can make these modifications!)**

Before anything else, there is a `.zip` file you should obtain from Microsoft's site, [Prerequisites for making Planner changes in Windows PowerShell](https://learn.microsoft.com/en-us/office365/planner/prerequisites-for-powershell). This page contains a link to the actual `.zip` file (only download this from the original source, I won't add the direct download link here), and also instructions on how to register it. I will list all steps here, just in case.

First, unzip the files, and unblock `plannertenantadmin.psm1` and `microsoft.identity.client.dll`.

Run **PowerShell as Administrator**. When you are prompted for authentication, **sign in as the global admin**, not the user you want to block or unblock.

Run the following command to enable running scripts downloaded from the internet for this session only.

```powershell
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope Process
```

Run the following command to import the PlannerTenantAdmin PowerShell script. This contains all available cmdlets for working with Planner.

```powershell
Import-module "<location of the plannertenantadmin.psm1 file you unzipped>"
```

To get a user's current policy, run the following cmdlet.

```powershell
Get-PlannerUserPolicy -UserAadIdOrPrincipalName "<User's AAD ID or UPN>" | fl
```

To block a user from deleting Planner tasks they didn't create, run the following cmdlet.

```powershell
Set-PlannerUserPolicy -UserAadIdOrPrincipalName "<User's AAD ID or UPN>" -BlockDeleteTasksNotCreatedBySelf $true
```

To block multiple users, you should create a `.csv` file that contains the users' AAD ID or UPN. Make an empty `.csv`, name the coloumn as, e. g. UserPrincipalName, and add all the UPNs to that coloumn. Now you can run the following function in PowerShell.

```powershell
function Set-Block-Users-from-Deleting-Task
 {
    param (
    $ImportcsvFilePath
    )
    process
    {
        #Set-PlannerUserPolicy
        Import-module "<location of the plannertenantadmin.psm1 file>"
        $AllUsers = Import-Csv -Path $ImportcsvFilePath
        foreach($Users in $AllUsers)
        {
        Set-PlannerUserPolicy -UserAadIdOrPrincipalName $Users.UserPrincipalName -BlockDeleteTasksNotCreatedBySelf $true
        }
    }
}
Set-Block-Users-from-Deleting-Task -ImportcsvFilePath "<Path of CSV file containing users to Block>"
```

You should test with the `Get-PlannerUserPolicy` cmdlet on some users if this worked correctly, and also check if you see the desired behaviour in Planner. If everything looks okay, these policies are set.

But what if you want to unblock some users (e. g. admins) after you have added this policy? You can run the previous command, just set the flag to `$false`.

```powershell
Set-PlannerUserPolicy -UserAadIdOrPrincipalName <user's AADId or UPN> -BlockDeleteTasksNotCreatedBySelf $false
```

## Disable Hyper-V

Okay, so why would you want to disable Hyper-V? Well, if you want to run a type-2 hypervisor like VirtualBox, an active type-1 hypervisor (Hyper-V) will practically create a nested virtualization, and this can really slow the VirtualBox guest OS down. Furthermore, to run a Linux VM efficiently, you should use KVM paravirtualization. That won't happen with an active Hyper-V.

You have probably unchecked Hyper-V in Windows Features, but your guest OS is still running like a snail... or a turtle. When you run your guest OS, check if you see a **green turtle icon** on the window. If you can see it, it means that Hyper-V is still running. Disabling Hyper-V is certainly tricky, but it can be done. Let me show you how.

First, every Windows service that uses Hyper-V must be disabled. This means Device Guard and Memory Integrity (also known as Hypervisor-protected Core Integrity, HVCI).

To **disable Device Guard**, run `gpedit.msc`, that opens the Local Group Policy Editor. Navigate to Local Computer Policy --> Computer Configuration --> Administrative Templates --> System --> Device Guard --> and **set** Turn on Virtualization Based Security **to Disabled**.

To **disable Memory Integrity**, open the Windows Defender Security Center and find Device Security. Select Core isolation and **turn off** Memory Integrity.

After these steps, restart you computer.

Now, open an elevated command line, and run the following commands to turn off Hyper-V.

```cmd
bcdedit /set hypervisorlaunchtype off
```

```cmd
bcdedit /set vsmlaunchtype off
```

Then shut down your computer with the following command.

```cmd
shutdown -s -t 2
```

You should **wait** at least **20-30 seconds**, before you turn it on again. After that however, when you run your VM, you should see a **blue V icon** instead of a green turtle. That means you have successfully disabled Hyper-V.

## Windows SysInternals Suite

I was quite surprised to find out that many system administrators do not know of or never even heard of the SysInternals Suite. I won't go into details, but I can't finish this article without at least mentioning them. So here are my favourite SysInternals apps in a table. The links lead to the official Microsoft documentation pages.

| Application                                                                                   | What it is                                                                                                                                                    |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Autoruns](https://learn.microsoft.com/en-us/sysinternals/downloads/autoruns)                 | Shows everything that is configured to automatically run under different circumstances. Any process can be run against Virus Total at once.                   |
| [ProcDump](https://learn.microsoft.com/en-us/sysinternals/downloads/procdump)                 | Command line utility for creating dump files when you want to figure out why a particular system/application is crashing, etc.                                |
| [Process Explorer](https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer) | Task Manager on steroids. Find what process is using a file, security tokens related to specific processes, etc.                                              |
| [Process Monitor](https://learn.microsoft.com/en-us/sysinternals/downloads/procmon)           | A historical overview of processes that have run from boot to shutdown with details, error messages, etc.                                                     |
| [TCPView](https://learn.microsoft.com/en-us/sysinternals/downloads/tcpview)                   | Shows detailed information about TCP and UDP endpoints, local and remote IP addresses, related processes, etc. Great when you don't have Wireshark installed. |
