#!/usr/bin/python
import smtplib

# SMTP_SERVER = 'mail.escoteirosmg.org.br'
# SMTP_PORT = 465
SMTP_USERNAME = 'contato@escoteirosmg.org.br'
SMTP_PASSWORD = '9u&CiS_odGyl'
# SMTP_FROM = 'contato@escoteirosmg.org.br'
# SMTP_TO = 'webviegas@gmail.com'
# TEXT_FILENAME = '/script/output/my_attachment.txt'
# MESSAGE = """This is the message
# to be sent to the client.
# """

sender = 'contato@escoteirosmg.org.br'
receiver = 'webviegas@gmail.com'

message = """From: Escoteiros de Minas <contato@escoteirosmg.org.br'>
To: Gustavo <webviegas@gmail.com>
Subject: SMTP e-mail test

This is a test e-mail message.
"""

try:
    print("trying host and port...")

    smtpObj = smtplib.SMTP_SSL('mail.escoteirosmg.org.br', 465)
    smtpObj.login(SMTP_USERNAME, SMTP_PASSWORD)

    print("sending mail...")

    smtpObj.sendmail(sender, receiver, message)

    print("Succesfully sent email")

except smtplib.SMTPException:
    print("Error: unable to send email")
    import traceback
    traceback.print_exc()
